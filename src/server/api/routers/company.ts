import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";

export const companyRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.company.findMany();
  }),
  create: privateProcedure.mutation(({ ctx }) => {
    // only create if the user doesn't already have a company associated with them
  })
});
