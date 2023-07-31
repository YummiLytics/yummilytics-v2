import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const segmentRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.segment.findMany()),
});
