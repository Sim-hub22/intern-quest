import { router } from "./index";
import { applicationRouter } from "./routers/application";
import { opportunityRouter } from "./routers/opportunity";
import { profileRouter } from "./routers/profile";

export const appRouter = router({
  opportunity: opportunityRouter,
  application: applicationRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
