import type { UserWebhookEvent } from "@clerk/nextjs/dist/server";
import type { NextApiResponse } from "next";
import type { NextRequest } from "next/server";
import { prisma } from "~/server/db";

export default async function handler(req: NextRequest, res: NextApiResponse) {
  // TODO: IMPORTANT!: Add svix verification for webhook request<F2>
  type ClerkWebhookRequestBody = {
    evt: UserWebhookEvent
  }
  const event = (req.body as unknown as ClerkWebhookRequestBody)?.evt;
  switch (event.type) {
    case "user.created":
      await prisma.user.create({
        data: {
          clerkId: event.data.id,
        },
      });
      return res.status(200).json({ req: req.headers });
  }
}
