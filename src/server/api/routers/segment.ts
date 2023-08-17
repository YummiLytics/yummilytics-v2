import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type FullSegment } from "~/types";

export const segmentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const segments = await ctx.prisma.segment.findMany({
      include: {
        segmentWithCategory: {
          include: {
            category: true,
          },
        },
      },
    });

    return segments.map((seg) => ({
      id: seg.id,
      name: seg.name,
      categories: seg.segmentWithCategory.map(segxcat => segxcat.category)
    })) as FullSegment[]
  }),
});
