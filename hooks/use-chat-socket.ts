import { useSocket } from "@/components/providers/socket-providers";
import { useQueryClient } from "@tanstack/react-query";
import { Member, Message, Profile } from "@prisma/client";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
  onMessageReceived?: (message: MessageWithMemberWithProfile) => void;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

export const useChatSocket = ({
  queryKey,
  addKey,
  updateKey,
  onMessageReceived,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    // Handle adding new messages
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{ items: [message] }],
          };
        }

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return { ...oldData, pages: newData };
      });

      if (onMessageReceived) {
        onMessageReceived(message);
      }
    });

    // Handle updating existing messages
    socket.on(updateKey, (updatedMessage: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === updatedMessage.id) {
                return updatedMessage;
              }
              return item;
            }),
          };
        });

        return { ...oldData, pages: newData };
      });
    });

    // Cleanup the socket listeners
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, updateKey, queryKey, onMessageReceived, socket]);
};
