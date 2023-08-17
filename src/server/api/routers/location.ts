import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { LocationSchema } from "~/types/schemas";

export const locationRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.location.findMany()),

  create: protectedProcedure
    .input(LocationSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.location.create({
        data: input,
      });
    }),
});
