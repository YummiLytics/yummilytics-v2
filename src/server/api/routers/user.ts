import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { UserSchema } from "~/types/schemas";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),

  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findFirst({
      where: {
        clerkId: ctx.userId,
      },
      include: {
        company: {
          include: {
            locations: true,
          },
        },
        locations: true,
      },
    });
  }),

  getByClerkId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: {
          clerkId: input.id,
        },
        include: {
          company: {
            include: {
              locations: true,
            },
          },
          locations: true,
        },
      });
    }),

  create: protectedProcedure
    .input(UserSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.create({
        data: {
          clerkId: input.clerkId,
          companyId: null,
        },
      });
    }),

  assignCompanyId: protectedProcedure
    .input(
      z.object({
        userId: z.coerce.number(),
        companyId: z.coerce.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          companyId: input.companyId,
        },
      });
    }),
});
