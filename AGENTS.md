# AGENTS.md - Coding Agent Guidelines

## Project Overview

- **Framework**: Next.js 16 with App Router (React 19)
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM
- **Authentication**: better-auth with email OTP and Google OAuth
- **UI**: shadcn/ui (New York style) with Tailwind CSS v4
- **Validation**: Zod v4 | **Server Actions**: next-safe-action

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
```

**Tests**: No test framework configured. When adding tests, use Vitest for unit tests.
Run single test: `pnpm vitest run path/to/test.ts`

## Directory Structure

```
src/
├── actions/          # Server actions (next-safe-action)
├── app/              # Next.js App Router (route groups: (auth), (public))
├── components/       # React components (forms/, ui/)
├── const/            # Constants
├── db/               # Drizzle schema and client
├── hooks/            # Custom React hooks
├── lib/              # Utilities (auth, safe-action, utils)
├── styles/           # Global styles
└── validations/      # Zod validation schemas
```

## Code Style Guidelines

### Import Ordering
1. Directives (`"use client"` / `"use server"`) at top
2. Internal imports using `@/` path alias
3. Third-party libraries
4. Next.js imports

```typescript
"use client";
import { loginAction } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `auth-action.ts`, `login-form.tsx` |
| Components | PascalCase | `LoginForm`, `HeroSection` |
| Functions | camelCase | `handleSubmit`, `sendVerificationEmail` |
| Server Actions | camelCase + `Action` | `loginAction`, `signUpAction` |
| Constants | SCREAMING_SNAKE_CASE | `MENU_ITEMS` |
| Types/Interfaces | PascalCase | `UserProfileProps` |

### Database Schema
```typescript
// camelCase in TS, snake_case in DB
export const user = pgTable("user", {
  emailVerified: boolean("email_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Server Actions Pattern
```typescript
"use server";
import { actionClient } from "@/lib/safe-action";
import { mySchema } from "@/validations/my-schema";

export const myAction = actionClient
  .inputSchema(mySchema)
  .action(async ({ parsedInput }) => {
    return { success: true };
  });
```

### Validation Schemas (Zod v4)
```typescript
export const mySchema = z.object({
  email: z.string()
    .check(z.minLength(1, "This field is required"))
    .check(z.email())
    .check(z.trim()),
  password: z.string().check(z.minLength(1, "This field is required")),
});
```

### Error Handling
```typescript
export const myAction = actionClient.inputSchema(mySchema).action(async ({ parsedInput }) => {
  try {
    // Action logic
    return { success: true };
  } catch (error: any) {
    if (error?.status === 403) {
      return { success: false, specificError: true };
    }
    throw error; // Re-throw unexpected errors
  }
});
```

### React Components
```typescript
export function MyComponent({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  // Hooks first, then logic, then return JSX
  return <div className={cn("base-styles", className)} {...props} />;
}
```

### UI Components (shadcn/ui)
```typescript
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
  variants: { variant: { default: "...", destructive: "..." } },
  defaultVariants: { variant: "default" },
});
```

### Forms with React Hook Form
```typescript
const { form, action: { isExecuting }, handleSubmitWithAction } = 
  useHookFormAction(myAction, zodResolver(mySchema), {
    actionProps: {
      onSuccess: ({ data }) => { /* handle success */ },
      onError: ({ error }) => { toast.error(error.serverError); },
    },
    formProps: { defaultValues: { email: "", password: "" } },
  });
```

## Configuration

- **ESLint**: Flat config (`eslint.config.mjs`) with Next.js Core Web Vitals + TypeScript
- **TypeScript**: Strict mode, path alias `@/*` maps to `./src/*`, target ES2017
- **Environment Variables**: Type-safe with `@t3-oss/env-nextjs` in `/src/env.ts`

## Key Libraries

| Library | Purpose | Docs |
|---------|---------|------|
| better-auth | Authentication | https://better-auth.com |
| Drizzle ORM | Database ORM | https://orm.drizzle.team |
| next-safe-action | Type-safe server actions | https://next-safe-action.dev |
| shadcn/ui | UI components | https://ui.shadcn.com |
| Zod v4 | Schema validation | https://zod.dev |
