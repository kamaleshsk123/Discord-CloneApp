"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);

  console.log("User:", user); // Log user object
  console.log("MediaRoom component rendered");

  useEffect(() => {
    if (!user?.username) {
      console.log("User name not available, exiting effect.");
      return;
    }

    const name = `${user.username}`;
    console.log("Fetching token for room:", chatId, "username:", name);

    const fetchUrl = `/api/livekit?room=${chatId}&username=${name}`;
    console.log("Fetch URL:", fetchUrl);

    (async () => {
      try {
        const resp = await fetch(fetchUrl);
        const data = await resp.json();
        console.log("Fetched token response:", data);

        if (resp.ok) {
          setToken(data.token);
        } else {
          setError(data.error);
          console.log("Error fetching token:", data.error);
        }
      } catch (e) {
        console.log("Fetch error:", e);
      }
    })();
  }, [user?.username, chatId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
