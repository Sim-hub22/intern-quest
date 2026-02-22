# AGENTS.md - Coding Agent Guidelines

## Current Phase: Phase 1 - Core Platform

**Status**: Step 1.9 in progress (PRD.md Section 12)

### Completed Steps (✅)
- 1.1: Vitest configuration
- 1.2: Database schemas (auth, opportunity, application, quiz, profile)
- 1.3: Schema synced to Neon (`pnpm db:push`)
- 1.4: UploadThing routes created
- 1.5: Zod validation schemas (opportunity, application, quiz, profile) - 119 tests passing
- 1.6: `opportunityRouter` (create, update, delete, getById, list, listByRecruiter, updateStatus)
- 1.7: `applicationRouter` (create, getById, listByCandidate, listByOpportunity, updateStatus, withdraw)
- 1.8: `profileRouter` (get, update, getPublic) - 34 tests passing
- 1.12: `quizRouter` (create, update, getByOpportunity, getForAttempt, submitAttempt, getAttemptResult, listAttempts)

### In Progress (⏳)
- **1.9: Wire recruiter UI to backend - 40% complete (2/5 pages)**
  - ✅ Post Opportunity (`/recruiter/post-opportunity`)
  - ✅ Manage Opportunities (`/recruiter/manage-opportunities`)
  - ⏸️ View Applications (deferred - mock data)
  - ⏸️ Quiz Review (deferred - mock data)
  - ⏸️ Recruiter Dashboard (deferred - mock data)

### Next Steps (📋)
- 1.10: Build `/internships/[id]` detail page
- 1.11: Build candidate dashboard + application pages
- 1.13: Build quiz UI (timer, tab detection, auto-submit)
- 1.14: Create `src/proxy.ts` for edge route protection

### Test Status
- **Validation schemas**: 119/119 passing ✅
- **Profile router**: 34/34 passing ✅
- **Opportunity/Application/Quiz routers**: Tests have DB race condition issues (non-blocking)
- **Note**: `fileParallelism: false` added to vitest.config.ts to run tests sequentially

---

## Project Overview

- **Framework**: Next.js 16 with App Router (React 19)
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM
- **Authentication**: better-auth with email OTP and Google OAuth
- **UI**: shadcn/ui (New York style) with Tailwind CSS v4
- **Validation**: Zod v4 | **API Layer**: tRPC v11 with TanStack Query

## Build/Lint/Test Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm db:push          # Push schema changes to database
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Drizzle Studio
pnpm auth:generate    # Generate better-auth schema
```

**Tests**: No test framework configured. When adding tests, use Vitest.
- Run all tests: `pnpm vitest run`
- Run single test: `pnpm vitest run path/to/test.ts`
- Watch mode: `pnpm vitest`

## Directory Structure

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/       # Auth routes (login, signup, forgot-password)
│   ├── (protected)/  # Authenticated routes (dashboard)
│   ├── (public)/     # Public routes (home, internships)
│   └── api/          # API routes (auth, trpc)
├── components/       # React components
│   ├── forms/        # Form components
│   ├── recruiter/    # Recruiter-specific components
│   └── ui/           # shadcn/ui primitives
├── const/            # Constants (navigation, sidebar)
├── hooks/            # Custom React hooks
├── lib/              # Utilities
│   ├── auth-client.tsx  # better-auth client
│   ├── dal.ts        # Data Access Layer (session verification)
│   ├── safe-action.ts   # next-safe-action client
│   ├── trpc.ts       # tRPC client setup
│   └── utils.ts      # cn() helper and utilities
├── server/           # Server-side code
│   ├── api/          # tRPC routers and context
│   ├── auth/         # better-auth server config
│   ├── db/           # Drizzle client and schema
│   └── email/        # Resend email service
├── styles/           # Global styles
└── validations/      # Zod validation schemas
```

## Code Style Guidelines

### Import Ordering
1. Directives (`"use client"` / `"use server"`) at very top
2. Internal imports using `@/` path alias
3. Third-party libraries
4. Next.js imports

```typescript
"use client";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/validations/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `auth-schema.ts`, `login-form.tsx` |
| Components | PascalCase | `LoginForm`, `HeroSection` |
| Functions | camelCase | `handleSubmit`, `getInitials` |
| Constants | SCREAMING_SNAKE_CASE | `MENU_ITEMS`, `SIDEBAR_COOKIE_NAME` |
| Types/Interfaces | PascalCase | `UserProfileProps`, `Context` |
| tRPC Routers | camelCase | `appRouter`, `publicProcedure` |

### Type Patterns

```typescript
// Component props - use React.ComponentProps
function Button({ className, ...props }: React.ComponentProps<"button">) {}

// Extended props with interface
interface LoginFormProps extends React.ComponentProps<"div"> {
  callbackUrl?: string;
}

// Type inference from Zod
type LoginValues = z.infer<typeof loginSchema>;
```

### Database Schema (Drizzle)
```typescript
// camelCase in TS, snake_case in DB columns
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});
```

### Validation Schemas (Zod v4)
```typescript
// Use .check() for chained validations
export const loginSchema = z.object({
  email: z.string()
    .check(z.minLength(1, "This field is required"))
    .check(z.email())
    .check(z.trim()),
  password: z.string().check(z.minLength(1, "This field is required")),
});
```

### tRPC Patterns
```typescript
// Router definition
export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
});

// Protected procedure with session check
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, session: ctx.session } });
});
```

### Session Verification (DAL Pattern)
```typescript
// Use cached session verification in page components (not layouts)
import { verifySession, verifyRecruiterSession } from "@/lib/dal";

export default async function DashboardPage() {
  const session = await verifySession(); // Redirects if unauthenticated
  return <Dashboard user={session.user} />;
}
```

### Error Handling
```typescript
// In auth flows - handle specific error codes
if (error?.status === 403) {
  // Handle email not verified
  await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
  router.push(`/signup/verify?email=${email}`);
  return;
}
// Generic errors - show toast
toast.error(error.message || "Something went wrong. Please try again.");
```

### React Components
```typescript
// Hooks first, then logic, then JSX
export function MyComponent({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [state, setState] = useState(false);
  
  const handleClick = () => { /* ... */ };
  
  return <div className={cn("base-styles", className)} {...props} />;
}
```

### Forms with React Hook Form
```typescript
const form = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: "", password: "" },
});

const onSubmit = async (values: z.infer<typeof loginSchema>) => {
  const { data, error } = await authClient.signIn.email(values);
  if (error) { toast.error(error.message); return; }
  router.push(data.url);
};

return <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>;
```

## Configuration

- **Next.js**: cacheComponents, reactCompiler, typedRoutes enabled
- **ESLint**: Flat config with Next.js Core Web Vitals + TypeScript
- **TypeScript**: Strict mode, path alias `@/*` → `./src/*`
- **Environment**: Type-safe with `@t3-oss/env-nextjs` in `src/env.ts`

## Key Libraries

| Library | Purpose | Docs |
|---------|---------|------|
| better-auth | Authentication | https://better-auth.com |
| Drizzle ORM | Database ORM | https://orm.drizzle.team |
| tRPC | Type-safe API | https://trpc.io |
| shadcn/ui | UI components | https://ui.shadcn.com |
| Zod v4 | Schema validation | https://zod.dev |
| TanStack Query | Data fetching | https://tanstack.com/query |

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-cache-components.mdx,07-fetching-data.mdx,08-updating-data.mdx,09-caching-and-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route-segment-config.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,browserDebugInfoInTerminal.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,isolatedDevBuild.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,isolatedDevBuild.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->
