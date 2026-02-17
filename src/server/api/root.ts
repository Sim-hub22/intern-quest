import { router } from "./index";
import { applicationRouter } from "./routers/application";
import { opportunityRouter } from "./routers/opportunity";
import { profileRouter } from "./routers/profile";
import { quizRouter } from "./routers/quiz";

export const appRouter = router({
  opportunity: opportunityRouter,
  application: applicationRouter,
  profile: profileRouter,
  quiz: quizRouter,
});

export type AppRouter = typeof appRouter;
