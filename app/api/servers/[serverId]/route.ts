import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    // Fetch the current profile
    const profileData = await currentProfile();

    // Check if the profile is available
    if (!profileData) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Extract name and imageUrl from the request body
    const { name, imageUrl } = await req.json();

    // Update the server in the database
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profileData.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    // Return the updated server details
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    // Fetch the current profile
    const profileData = await currentProfile();

    // Check if the profile is available
    if (!profileData) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the server from the database
    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profileData.id,
      },
    });

    // Return the deleted server details
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
