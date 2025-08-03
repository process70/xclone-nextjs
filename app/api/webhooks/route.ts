import { prisma } from "@/lib/prisma";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    if (eventType === "user.created") {
      try {
        await prisma.user.create({
          data: {
            id: id || crypto.randomUUID(), // Using built-in crypto
            email: evt.data.email_addresses[0].email_address,
            username:
              evt.data.username || `user-${crypto.randomUUID().slice(0, 8)}`,
          },
        });
        return new Response("user created", { status: 200 });
      } catch (error) {
        return new Response("Failed to create user: " + error, { status: 500 });
      }
    }

    if (eventType === "user.deleted") {
      try {
        console.log("userId:", evt.data.id);
        await prisma.user.delete({
          where: {
            id: evt.data.id,
          },
        });
        return new Response("user deleted", { status: 200 });
      } catch (error) {
        return new Response("Failed to delete user: " + error, { status: 500 });
      }
    }
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
