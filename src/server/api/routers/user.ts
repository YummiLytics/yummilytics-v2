import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { NewUserSchema } from "~/types/schemas";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),

  getByClerkId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: {
          clerkId: input,
        },
      });
    }),

  create: protectedProcedure
    .input(NewUserSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.create({
        data: input,
      });
    }),
});
