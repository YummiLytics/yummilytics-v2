import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { CompanySchema } from "~/types/schemas";

export const companyRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.company.findMany();
  }),

  getCurrentCompany: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.company.findFirst({
      where: {
        user: {
          clerkId: ctx.userId,
        },
      },
    });
  }),

  getById: publicProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.prisma.company.findUnique({
      where: {
        id: input,
      },
    });
  }),

  create: protectedProcedure
    .input(CompanySchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.company.create({
        data: input,
      });
    }),
});
