import { createTRPCRouter } from "~/server/api/trpc";
import { locationRouter } from "./routers/location";
import { companyRouter } from "./routers/company";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  companies: companyRouter,
  locations: locationRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
