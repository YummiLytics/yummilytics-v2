import { UserWebhookEvent } from "@clerk/nextjs/dist/server";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { prisma } from "~/server/db";

export default async function handler(req: NextRequest, res: NextApiResponse) {
  // TODO: IMPORTANT!: Add svix verification for webhook request<F2>
  //@ts-ignore
  const event = req.body?.evt as UserWebhookEvent;
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
