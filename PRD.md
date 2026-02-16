# InternQuest - Product Requirements Document

## 1. Project Overview

**InternQuest** is a web-based internship recruitment and management platform that connects candidates with recruiters. It provides internship discovery, application management, quiz-based evaluation, and educational resources.

### 1.1 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript (strict) | 5.9.x |
| UI Runtime | React | 19.2.x |
| Package Manager | pnpm | - |
| Database | PostgreSQL (Neon serverless) | - |
| ORM | Drizzle ORM | 0.45.x |
| Authentication | better-auth (email OTP + Google OAuth) | 1.4.x |
| API Layer | tRPC v11 + TanStack Query v5 | 11.9.x |
| Validation | Zod v4 | 4.3.x |
| UI Components | shadcn/ui (New York style) | - |
| Styling | Tailwind CSS v4 | 4.1.x |
| Cache/KV | Upstash Redis | 1.36.x |
| Email | Resend | 6.9.x |
| File Upload | UploadThing | TBD |
| Testing | Vitest | TBD |

### 1.2 Scale & Context

- **Type**: Final Year Project (FYP) demo
- **Expected users**: Under 100 total, 5-10 recruiters
- **Deployment**: Vercel (Next.js) + Neon (PostgreSQL) + Upstash (Redis)

---

## 2. Current State Assessment

### 2.1 What's Built & Working

| Feature | Status | Location |
|---------|--------|----------|
| Email/password authentication | Done | `src/app/(auth)/login`, `src/app/(auth)/signup` |
| Google OAuth | Done | better-auth config |
| Email OTP verification | Done | `src/app/(auth)/signup/verify` |
| Forgot/reset password flow | Done | `src/app/(auth)/forgot-password/*` |
| Session management (cookie + Redis rate limiting) | Done | `src/server/auth/index.ts` |
| Role-based signup (candidate/recruiter) | Done | Signup form with role selector |
| DAL session verification (cached) | Done | `src/lib/dal.ts` — `verifySession`, `verifyRecruiterSession`, `verifyAdminSession` |
| Database schema (auth tables only) | Done | `src/server/db/schema/auth.ts` |
| tRPC infrastructure | Done | `src/server/api/` — only `healthCheck` endpoint |
| Email service (Resend) | Done | `src/server/email/emails.ts` |
| Theme toggling (light/dark) | Done | next-themes |
| Type-safe environment variables | Done | `src/env.ts` via `@t3-oss/env-nextjs` |

### 2.2 Built But Hardcoded (No Backend)

| Page | Route | What Needs Backend |
|------|-------|--------------------|
| Landing page | `/` | Hero, categories, featured opportunities |
| Browse internships | `/internships` | 9 fake internships from mock data |
| Resources | `/resources` | 6 mock articles + 6 mock quizzes |
| Recruiter dashboard | `/recruiter/dashboard` | Stats, activity feed, deadlines |
| Post opportunity | `/recruiter/post-opportunity` | 4-step wizard, console.log only |
| Manage opportunities | `/recruiter/manage-opportunities` | Hardcoded table |
| View applications | `/recruiter/view-applications` | Hardcoded application data |
| Quiz review | `/recruiter/quiz-review` | Hardcoded quiz attempts |

### 2.3 Not Started

- No database tables for business logic (opportunities, applications, quizzes, resources, notifications)
- No `proxy.ts` for edge route protection
- No candidate dashboard or candidate-specific pages
- No admin pages or admin navigation
- No profile management
- No file upload system (UploadThing not installed)
- No notification system
- No real tRPC routers beyond `healthCheck`
- No tests

---

## 3. Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| File storage | **UploadThing** | Auth-gated uploads via middleware, pre-built UI components, generous free tier (2GB), no Vercel lock-in, tRPC compatible |
| Internship moderation | **No admin approval required** | Recruiters publish directly; admins can remove inappropriate postings post-hoc |
| Real-time notifications | **TanStack Query polling (15s)** | Simple for FYP scale; Upstash Redis caches unread counts; no WebSocket complexity |
| Content editing | **Plain text** | Textarea for internship descriptions and resource articles; no rich text editor needed |
| Student profile | **Simple** | Name, email, bio, phone, location, resume, profile picture only |
| Search strategy | **PostgreSQL full-text search + indexed columns** | Sufficient for FYP-scale data volumes |
| Route protection (edge) | **`proxy.ts`** | Next.js 16 convention (replaces deprecated `middleware.ts`); lightweight cookie check before routes render |

---

## 4. Subsystems & Requirements

### 4.1 User Management Subsystem

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| U-01 | Email/password registration with role selection (candidate/recruiter) | P0 | Done |
| U-02 | Google OAuth login/signup | P0 | Done |
| U-03 | Email OTP verification on signup | P0 | Done |
| U-04 | Forgot/reset password via email OTP | P0 | Done |
| U-05 | Session management with cookie caching (5-min TTL) | P0 | Done |
| U-06 | Rate limiting via Upstash Redis | P0 | Done |
| U-07 | User profile viewing and editing (bio, phone, location, resume, linkedIn, website) | P0 | Not Started |
| U-08 | Profile image upload | P1 | Not Started |
| U-09 | Role-based route guards via DAL functions | P0 | Done |
| U-10 | Edge route protection via `proxy.ts` | P1 | Not Started |
| U-11 | Ban/unban users (admin) | P1 | Not Started |

### 4.2 Internship & Opportunity Management Subsystem

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| O-01 | Create internship opportunity (title, description, type, location, stipend, deadline, skills, requirements) | P0 | Not Started |
| O-02 | Edit existing opportunity | P0 | Not Started |
| O-03 | Delete/archive opportunity | P0 | Not Started |
| O-04 | List recruiter's own opportunities with status filters | P0 | Not Started |
| O-05 | Browse all published opportunities (public) | P0 | Partial (UI exists, hardcoded) |
| O-06 | Search opportunities by keyword (PostgreSQL full-text) | P0 | Not Started |
| O-07 | Filter opportunities by type, location, category | P0 | Not Started |
| O-08 | Paginated results | P0 | Not Started |
| O-09 | Opportunity detail page (`/internships/[id]`) | P0 | Not Started |
| O-10 | Opportunity status lifecycle: draft -> published -> closed -> archived | P1 | Not Started |
| O-11 | Featured opportunities on landing page (most recent published) | P2 | Not Started |

### 4.3 Application Management Subsystem

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| A-01 | Submit application (cover letter text + resume upload) | P0 | Not Started |
| A-02 | Withdraw application | P0 | Not Started |
| A-03 | View own applications with status (candidate) | P0 | Not Started |
| A-04 | View applications for an opportunity (recruiter) | P0 | Not Started |
| A-05 | Update application status: pending -> reviewing -> shortlisted -> accepted/rejected | P0 | Not Started |
| A-06 | Prevent duplicate applications to same opportunity | P0 | Not Started |
| A-07 | Application counts on recruiter dashboard | P1 | Not Started |
| A-08 | Download applicant resume | P1 | Not Started |

### 4.4 Quiz & Evaluation Subsystem

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| Q-01 | Create quiz linked to an opportunity (recruiter) | P0 | Not Started |
| Q-02 | Add multiple-choice questions with correct answer | P0 | Not Started |
| Q-03 | Set quiz duration (minutes) and passing score | P0 | Not Started |
| Q-04 | Candidate takes quiz with countdown timer | P0 | Not Started |
| Q-05 | Tab-switch/visibility-change detection during quiz | P0 | Not Started |
| Q-06 | Auto-submit on timer expiry | P0 | Not Started |
| Q-07 | Auto-grade MCQ answers and calculate score | P0 | Not Started |
| Q-08 | View quiz results (candidate sees score, recruiter sees all attempts) | P0 | Not Started |
| Q-09 | Prevent retaking same quiz | P1 | Not Started |
| Q-10 | Quiz attempt analytics on recruiter dashboard | P2 | Not Started |

### 4.5 Resources Management Subsystem

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| R-01 | Admin creates educational resources (articles with plain text content) | P1 | Not Started |
| R-02 | Admin uploads resource files (PDFs, documents) | P1 | Not Started |
| R-03 | Browse resources publicly | P1 | Partial (UI exists, hardcoded) |
| R-04 | Search/filter resources by category | P1 | Not Started |
| R-05 | Download resource files (authenticated users) | P1 | Not Started |
| R-06 | Track resource downloads | P2 | Not Started |

### 4.6 Notification Subsystem

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| N-01 | In-app notifications stored in database | P1 | Not Started |
| N-02 | Unread notification count (cached in Redis) | P1 | Not Started |
| N-03 | Mark individual/all notifications as read | P1 | Not Started |
| N-04 | Notification triggers: application status change, new application received, quiz invitation, quiz result | P1 | Not Started |
| N-05 | Email notifications for critical events (application accepted/rejected) via Resend | P1 | Not Started |
| N-06 | TanStack Query polling (15s interval) for real-time updates | P1 | Not Started |
| N-07 | Notification bell in header with unread badge | P1 | Not Started |

### 4.7 Admin Management Subsystem

| ID | Requirement | Priority | Status |
|----|------------|----------|--------|
| AD-01 | Admin dashboard with platform statistics | P1 | Not Started |
| AD-02 | User management (list, view, ban/unban) | P1 | Not Started |
| AD-03 | Remove inappropriate opportunities | P1 | Not Started |
| AD-04 | Manage resources (CRUD) | P1 | Not Started |
| AD-05 | View platform analytics (user counts, application trends) | P2 | Not Started |

---

## 5. Database Schema

### 5.1 Existing Tables (Auth - No Changes)

```
user            — id, name, email, emailVerified, image, role, banned, banReason, banExpires, organization, createdAt, updatedAt
account         — id, accountId, providerId, userId (FK→user), accessToken, refreshToken, idToken, scope, password, ...timestamps
verification    — id, identifier, value, expiresAt, ...timestamps
```

### 5.2 User Table Additions

Add the following columns to the existing `user` table:

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `bio` | text | null | Short biography |
| `phone` | text | null | Phone number |
| `location` | text | null | City/country |
| `resumeUrl` | text | null | UploadThing URL for resume |
| `linkedinUrl` | text | null | LinkedIn profile URL |
| `website` | text | null | Personal website URL |

### 5.3 New Tables

#### `opportunity`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PK | CUID |
| `title` | text | NOT NULL | Opportunity title |
| `description` | text | NOT NULL | Plain text description |
| `type` | text (enum) | NOT NULL | `internship`, `fellowship`, `volunteer` |
| `mode` | text (enum) | NOT NULL | `remote`, `onsite`, `hybrid` |
| `location` | text | | Office location (if onsite/hybrid) |
| `category` | text | NOT NULL | e.g., `engineering`, `design`, `marketing`, `business`, `data-science` |
| `skills` | text[] | | Array of required skill tags |
| `stipend` | integer | | Monthly stipend in NPR (null = unpaid) |
| `duration` | text | | e.g., "3 months", "6 months" |
| `deadline` | timestamp | NOT NULL | Application deadline |
| `positions` | integer | DEFAULT 1 | Number of open positions |
| `status` | text (enum) | DEFAULT `draft` | `draft`, `published`, `closed`, `archived` |
| `recruiterId` | text | FK→user, NOT NULL | Creator |
| `createdAt` | timestamp | DEFAULT now() | |
| `updatedAt` | timestamp | DEFAULT now() | |

**Indexes**: `recruiterId`, `status`, `category`, `deadline`

#### `application`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PK | CUID |
| `opportunityId` | text | FK→opportunity, NOT NULL | |
| `candidateId` | text | FK→user, NOT NULL | |
| `coverLetter` | text | | Plain text cover letter |
| `resumeUrl` | text | | UploadThing URL (can differ from profile resume) |
| `status` | text (enum) | DEFAULT `pending` | `pending`, `reviewing`, `shortlisted`, `accepted`, `rejected`, `withdrawn` |
| `appliedAt` | timestamp | DEFAULT now() | |
| `updatedAt` | timestamp | DEFAULT now() | |

**Indexes**: `opportunityId`, `candidateId`
**Unique constraint**: `(opportunityId, candidateId)` — prevents duplicate applications

#### `quiz`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PK | CUID |
| `opportunityId` | text | FK→opportunity, NOT NULL | Linked opportunity |
| `title` | text | NOT NULL | Quiz title |
| `description` | text | | Instructions |
| `durationMinutes` | integer | NOT NULL | Time limit |
| `passingScore` | integer | NOT NULL | Minimum % to pass |
| `isActive` | boolean | DEFAULT true | Whether quiz is accepting attempts |
| `createdAt` | timestamp | DEFAULT now() | |
| `updatedAt` | timestamp | DEFAULT now() | |

**Indexes**: `opportunityId`

#### `quizQuestion`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PK | CUID |
| `quizId` | text | FK→quiz, NOT NULL | |
| `questionText` | text | NOT NULL | The question |
| `options` | jsonb | NOT NULL | Array of `{ label: string, value: string }` |
| `correctAnswer` | text | NOT NULL | The correct option value |
| `points` | integer | DEFAULT 1 | Points for correct answer |
| `order` | integer | NOT NULL | Display order |
| `createdAt` | timestamp | DEFAULT now() | |

**Indexes**: `quizId`

#### `quizAttempt`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PK | CUID |
| `quizId` | text | FK→quiz, NOT NULL | |
| `candidateId` | text | FK→user, NOT NULL | |
| `score` | integer | | Calculated score (%) |
| `passed` | boolean | | Whether score >= passingScore |
| `tabSwitchCount` | integer | DEFAULT 0 | Detected tab switches |
| `startedAt` | timestamp | DEFAULT now() | |
| `submittedAt` | timestamp | | Null until submitted |

**Indexes**: `quizId`, `candidateId`
**Unique constraint**: `(quizId, candidateId)` — prevents retaking

#### `quizAnswer`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PK | CUID |
| `attemptId` | text | FK→quizAttempt, NOT NULL | |
| `questionId` | text | FK→quizQuestion, NOT NULL | |
| `selectedAnswer` | text | | The candidate's answer |
| `isCorrect` | boolean | | Graded result |

**Indexes**: `attemptId`

#### `resource`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PK | CUID |
| `title` | text | NOT NULL | Resource title |
| `description` | text | | Short description |
| `content` | text | | Plain text article content |
| `category` | text | NOT NULL | e.g., `resume-tips`, `interview-prep`, `career-guide`, `skill-building` |
| `fileUrl` | text | | UploadThing URL for downloadable file |
| `authorId` | text | FK→user, NOT NULL | Admin who created it |
| `isPublished` | boolean | DEFAULT false | |
| `createdAt` | timestamp | DEFAULT now() | |
| `updatedAt` | timestamp | DEFAULT now() | |

**Indexes**: `category`, `isPublished`

#### `resourceDownload`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PK | CUID |
| `resourceId` | text | FK→resource, NOT NULL | |
| `userId` | text | FK→user, NOT NULL | |
| `downloadedAt` | timestamp | DEFAULT now() | |

**Indexes**: `resourceId`

#### `notification`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PK | CUID |
| `userId` | text | FK→user, NOT NULL | Recipient |
| `type` | text (enum) | NOT NULL | `application_received`, `application_status_changed`, `quiz_invitation`, `quiz_result`, `opportunity_closed`, `system` |
| `title` | text | NOT NULL | Notification title |
| `message` | text | NOT NULL | Notification body |
| `linkUrl` | text | | Deep link to relevant page |
| `isRead` | boolean | DEFAULT false | |
| `createdAt` | timestamp | DEFAULT now() | |

**Indexes**: `userId`, `isRead`, `createdAt`

### 5.4 Relations Summary

```
user 1──N opportunity     (recruiter creates opportunities)
user 1──N application     (candidate applies)
opportunity 1──N application
opportunity 1──1 quiz     (optional: recruiter attaches quiz)
quiz 1──N quizQuestion
quiz 1──N quizAttempt
quizAttempt 1──N quizAnswer
quizQuestion 1──N quizAnswer
user 1──N quizAttempt     (candidate takes quizzes)
user 1──N notification    (recipient)
user 1──N resource        (admin authors)
resource 1──N resourceDownload
user 1──N resourceDownload
```

---

## 6. tRPC Router Architecture

### 6.1 Router Structure

```
appRouter
├── healthCheck              (public)       — existing
├── opportunity              (nested router)
│   ├── create               (recruiter)    — create new opportunity
│   ├── update               (recruiter)    — edit own opportunity
│   ├── delete               (recruiter)    — soft delete/archive
│   ├── getById              (public)       — single opportunity detail
│   ├── list                 (public)       — browse with search/filter/pagination
│   ├── listByRecruiter      (recruiter)    — own opportunities with status filters
│   └── updateStatus         (recruiter)    — draft/published/closed/archived
├── application              (nested router)
│   ├── create               (candidate)    — submit application
│   ├── withdraw             (candidate)    — withdraw own application
│   ├── listByCandidate      (candidate)    — own applications with status
│   ├── listByOpportunity    (recruiter)    — applications for a specific opportunity
│   ├── updateStatus         (recruiter)    — pending/reviewing/shortlisted/accepted/rejected
│   └── getById              (protected)    — single application detail
├── quiz                     (nested router)
│   ├── create               (recruiter)    — create quiz + questions
│   ├── update               (recruiter)    — edit quiz
│   ├── getByOpportunity     (protected)    — get quiz for an opportunity
│   ├── getForAttempt        (candidate)    — get quiz questions (without answers) for taking
│   ├── submitAttempt        (candidate)    — submit answers, auto-grade
│   ├── getAttemptResult     (protected)    — view attempt score
│   └── listAttempts         (recruiter)    — all attempts for a quiz
├── resource                 (nested router)
│   ├── create               (admin)        — create resource
│   ├── update               (admin)        — edit resource
│   ├── delete               (admin)        — delete resource
│   ├── list                 (public)       — browse published resources
│   ├── getById              (public)       — single resource detail
│   └── trackDownload        (protected)    — log file download
├── notification             (nested router)
│   ├── list                 (protected)    — user's notifications (paginated)
│   ├── getUnreadCount       (protected)    — cached in Redis
│   ├── markAsRead           (protected)    — mark single as read
│   └── markAllAsRead        (protected)    — mark all as read
├── profile                  (nested router)
│   ├── get                  (protected)    — get own profile
│   ├── update               (protected)    — update profile fields
│   └── getPublic            (public)       — public profile view (limited fields)
└── admin                    (nested router)
    ├── listUsers            (admin)        — paginated user list
    ├── getUserById          (admin)        — user detail
    ├── banUser              (admin)        — ban/unban
    ├── removeOpportunity    (admin)        — force-remove opportunity
    └── getStats             (admin)        — platform statistics
```

### 6.2 Procedure Authorization

| Procedure Type | Auth Check | Implementation |
|---------------|-----------|----------------|
| `publicProcedure` | None | Existing in `src/server/api/index.ts` |
| `protectedProcedure` | Session exists | Existing in `src/server/api/index.ts` |
| `recruiterProcedure` | Session + role=recruiter | New — extends protectedProcedure |
| `candidateProcedure` | Session + role=candidate | New — extends protectedProcedure |
| `adminProcedure` | Session + role=admin | New — extends protectedProcedure |

---

## 7. Route Map

### 7.1 Public Routes (`(public)` group)

| Route | Page | Status |
|-------|------|--------|
| `/` | Landing page (hero, categories, featured opportunities) | Exists (hardcoded) |
| `/internships` | Browse opportunities with search/filter | Exists (hardcoded) |
| `/internships/[id]` | Opportunity detail + apply button | Not Started |
| `/resources` | Browse educational resources | Exists (hardcoded) |
| `/resources/[id]` | Resource detail + download | Not Started |

### 7.2 Auth Routes (`(auth)` group)

| Route | Page | Status |
|-------|------|--------|
| `/login` | Login form | Done |
| `/signup` | Signup form with role selection | Done |
| `/signup/verify` | Email OTP verification | Done |
| `/forgot-password` | Request password reset | Done |
| `/forgot-password/verify` | Verify reset OTP | Done |
| `/forgot-password/reset` | Set new password | Done |

### 7.3 Candidate Routes (`(protected)`)

| Route | Page | Status |
|-------|------|--------|
| `/dashboard` | Candidate dashboard (application stats, recent activity) | Not Started |
| `/applications` | List of own applications with status | Not Started |
| `/applications/[id]` | Application detail (status timeline, quiz link) | Not Started |
| `/quiz/[id]` | Take quiz (timer, tab detection, auto-submit) | Not Started |
| `/quiz/[id]/result` | View quiz result | Not Started |
| `/profile` | View/edit profile | Not Started |
| `/notifications` | Notification center | Not Started |

### 7.4 Recruiter Routes (`(protected)/recruiter`)

| Route | Page | Status |
|-------|------|--------|
| `/recruiter/dashboard` | Recruiter dashboard (stats, activity, deadlines) | Exists (hardcoded) |
| `/recruiter/post-opportunity` | 4-step opportunity creation wizard | Exists (hardcoded) |
| `/recruiter/manage-opportunities` | List/manage own opportunities | Exists (hardcoded) |
| `/recruiter/manage-opportunities/[id]/edit` | Edit opportunity | Not Started |
| `/recruiter/view-applications` | View applications across opportunities | Exists (hardcoded) |
| `/recruiter/view-applications/[id]` | Single application detail | Not Started |
| `/recruiter/quiz-review` | Review quiz attempts | Exists (hardcoded) |
| `/recruiter/quiz-review/[id]` | Detailed quiz attempt review | Not Started |
| `/recruiter/create-quiz/[opportunityId]` | Create/edit quiz for opportunity | Not Started |

### 7.5 Admin Routes (`(protected)/admin`)

| Route | Page | Status |
|-------|------|--------|
| `/admin/dashboard` | Admin dashboard (platform stats) | Not Started |
| `/admin/users` | User management (list, search, ban) | Not Started |
| `/admin/users/[id]` | User detail | Not Started |
| `/admin/opportunities` | Opportunity oversight (review, remove) | Not Started |
| `/admin/resources` | Resource management (CRUD) | Not Started |
| `/admin/resources/create` | Create new resource | Not Started |
| `/admin/resources/[id]/edit` | Edit resource | Not Started |

### 7.6 API Routes

| Route | Handler | Status |
|-------|---------|--------|
| `/api/auth/[...all]` | better-auth catch-all | Done |
| `/api/trpc/[trpc]` | tRPC catch-all | Done |
| `/api/uploadthing` | UploadThing route handler | Not Started |

---

## 8. File Upload (UploadThing)

### 8.1 Upload Routes

| Route Name | Allowed Types | Max Size | Auth | Purpose |
|-----------|--------------|----------|------|---------|
| `resumeUpload` | PDF | 4MB | Candidate | Profile resume |
| `coverLetterUpload` | PDF | 4MB | Candidate | Application-specific resume/cover letter |
| `profileImage` | image/* | 2MB | Any authenticated | Profile picture |
| `resourceFile` | PDF, DOCX | 8MB | Admin | Educational resource attachments |

### 8.2 Integration Points

- Install: `pnpm add uploadthing @uploadthing/react`
- Add `UPLOADTHING_TOKEN` to `src/env.ts`
- API route: `src/app/api/uploadthing/route.ts`
- Core config: `src/server/uploadthing.ts` (file router definition)
- Client hooks: `src/lib/uploadthing.ts` (generated via `generateReactHelpers`)

---

## 9. Notification Architecture

### 9.1 Delivery Mechanism

```
Event Trigger (tRPC mutation)
    │
    ├──> Write notification to DB (notification table)
    ├──> Increment unread count in Redis (INCR user:{userId}:unread)
    └──> Send email via Resend (critical events only)

Client Polling (TanStack Query, 15s refetchInterval)
    │
    ├──> getUnreadCount (reads from Redis — fast)
    └──> list (reads from DB — on notification page)
```

### 9.2 Notification Triggers

| Event | Recipient | Email? | Type |
|-------|-----------|--------|------|
| New application received | Recruiter | No | `application_received` |
| Application status changed | Candidate | Yes (accepted/rejected only) | `application_status_changed` |
| Quiz invitation (quiz attached to opportunity) | Candidates who applied | No | `quiz_invitation` |
| Quiz graded | Candidate | No | `quiz_result` |
| Opportunity closed | Candidates with pending applications | No | `opportunity_closed` |

### 9.3 Redis Keys

| Key Pattern | Type | TTL | Purpose |
|-------------|------|-----|---------|
| `user:{userId}:unread` | Integer | None | Unread notification count |

- On notification create: `INCR user:{userId}:unread`
- On mark as read: `DECR user:{userId}:unread`
- On mark all read: `DEL user:{userId}:unread`

---

## 10. Edge Route Protection (`proxy.ts`)

### 10.1 Overview

Create `src/proxy.ts` (Next.js 16 convention, replaces deprecated `middleware.ts`) for lightweight edge-level route protection.

### 10.2 Logic

```typescript
// src/proxy.ts
export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  // Unauthenticated → redirect to login
  if (!sessionCookie && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
  }

  // Authenticated → redirect away from auth pages
  if (sessionCookie && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

**Note**: This is a lightweight cookie-existence check only. Full role-based authorization happens in DAL functions (`verifyRecruiterSession`, `verifyAdminSession`) at the page component level.

---

## 11. Testing Strategy

### 11.1 Framework & Approach

| Aspect | Choice |
|--------|--------|
| Framework | **Vitest** |
| Approach | **Strict TDD** — write failing tests first, then implement |
| Scope | **Backend unit tests** only (tRPC routers, validation schemas, DAL functions, utilities) |

### 11.2 Test File Conventions

- **Location**: Co-located `__tests__/` folders next to source files
- **Naming**: `*.test.ts` for unit tests
- **Structure**:

```
src/
├── server/
│   ├── api/
│   │   ├── routers/
│   │   │   ├── __tests__/
│   │   │   │   ├── opportunity.test.ts
│   │   │   │   ├── application.test.ts
│   │   │   │   ├── quiz.test.ts
│   │   │   │   ├── resource.test.ts
│   │   │   │   ├── notification.test.ts
│   │   │   │   ├── profile.test.ts
│   │   │   │   └── admin.test.ts
│   │   │   ├── opportunity.ts
│   │   │   ├── application.ts
│   │   │   └── ...
│   │   └── __tests__/
│   │       └── context.test.ts
│   └── db/
│       └── schema/
│           └── __tests__/
│               └── validations.test.ts
├── validations/
│   └── __tests__/
│       ├── auth-schema.test.ts
│       ├── opportunity-schema.test.ts
│       ├── application-schema.test.ts
│       └── quiz-schema.test.ts
└── lib/
    └── __tests__/
        ├── dal.test.ts
        └── utils.test.ts
```

### 11.3 Commands

```bash
pnpm vitest run              # Run all tests once
pnpm vitest run path/to/test # Run single test file
pnpm vitest                  # Watch mode
pnpm vitest --coverage       # Coverage report
```

### 11.4 What to Test

| Layer | What to Test | Mocking Strategy |
|-------|-------------|------------------|
| **Zod schemas** | Valid/invalid inputs, edge cases, error messages | None needed |
| **tRPC routers** | Input validation, authorization (role checks), CRUD logic, error handling | Mock `db` (Drizzle queries), mock `ctx.session` |
| **DAL functions** | Session verification, role checks, redirect behavior | Mock `auth.api.getSession`, mock `headers()`, mock `redirect()` |
| **Utility functions** | `cn()`, helpers, formatters | None needed |
| **Notification service** | Trigger logic, Redis operations | Mock `db`, mock Redis client |

### 11.5 TDD Workflow Per Feature

```
1. Write Zod validation schema tests     → Run (FAIL) → Implement schema     → Run (PASS)
2. Write tRPC router procedure tests     → Run (FAIL) → Implement procedure  → Run (PASS)
3. Wire UI to real backend
4. Manual verification in browser
```

### 11.6 Mocking Patterns

**Mock tRPC context (session):**
```typescript
const mockCandidateCtx = {
  session: {
    user: { id: "user-1", role: "candidate", name: "Test", email: "test@test.com" },
    session: { id: "session-1" },
  },
};

const mockRecruiterCtx = {
  session: {
    user: { id: "user-2", role: "recruiter", name: "Recruiter", email: "recruiter@test.com" },
    session: { id: "session-2" },
  },
};
```

**Mock database (Drizzle):**
```typescript
// Use vi.mock to mock the db module
vi.mock("@/server/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    query: { opportunity: { findFirst: vi.fn(), findMany: vi.fn() } },
  },
}));
```

---

## 12. Implementation Plan

### Phase 1: Core Platform (P0)

**Strict TDD approach: tests first for all backend code.**

| Step | Task | Dependencies | TDD |
|------|------|-------------|-----|
| 1.1 | Set up Vitest configuration | None | - |
| 1.2 | Design & create all database schema files | None | Schema validation tests first |
| 1.3 | Run `pnpm db:push` to sync schema to Neon | 1.2 | - |
| 1.4 | Install UploadThing, create upload routes | None | - |
| 1.5 | Write Zod validation schemas (opportunity, application, quiz, profile) | None | Tests first |
| 1.6 | Build `opportunityRouter` (CRUD + search/filter/pagination) | 1.2, 1.5 | Tests first |
| 1.7 | Build `applicationRouter` (apply, withdraw, status management) | 1.2, 1.5 | Tests first |
| 1.8 | Build `profileRouter` (get/update profile) | 1.2, 1.5 | Tests first |
| 1.9 | Wire existing recruiter UI pages to real backend | 1.6, 1.7 | - |
| 1.10 | Build `/internships/[id]` detail page | 1.6 | - |
| 1.11 | Build candidate dashboard + application pages | 1.7, 1.8 | - |
| 1.12 | Build quiz system (creation + taking + auto-grading) | 1.2, 1.5 | Tests first |
| 1.13 | Build quiz UI (timer, tab detection, auto-submit) | 1.12 | - |
| 1.14 | Create `src/proxy.ts` for edge route protection | None | - |

### Phase 2: Resources, Notifications & Admin (P1)

| Step | Task | Dependencies | TDD |
|------|------|-------------|-----|
| 2.1 | Build `resourceRouter` | Schema | Tests first |
| 2.2 | Build resource browse/detail pages | 2.1 | - |
| 2.3 | Build admin resource management pages | 2.1 | - |
| 2.4 | Build `notificationRouter` + Redis integration | Schema | Tests first |
| 2.5 | Add notification bell component + polling | 2.4 | - |
| 2.6 | Wire notification triggers into existing routers | 2.4 | - |
| 2.7 | Build `adminRouter` (user management, stats) | Schema | Tests first |
| 2.8 | Build admin dashboard + user management pages | 2.7 | - |
| 2.9 | Email notifications for critical events | 2.4 | Tests first |

### Phase 3: Analytics & Polish (P2)

| Step | Task |
|------|------|
| 3.1 | Recruiter analytics (application trends, quiz performance) |
| 3.2 | Admin platform analytics |
| 3.3 | Resource download tracking |
| 3.4 | Featured opportunities on landing page |
| 3.5 | UI polish, loading states, error boundaries |
| 3.6 | Performance optimization (caching, lazy loading) |
| 3.7 | Accessibility audit |

---

## 13. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Page load < 3s on 3G; TanStack Query caching for repeated data |
| **Security** | Session-based auth; role checks at DAL + proxy layers; CSRF protection via better-auth; input validation via Zod on all tRPC inputs |
| **Accessibility** | WCAG 2.1 AA compliance; keyboard navigation; screen reader support via shadcn/ui primitives |
| **SEO** | Next.js metadata API for public pages; Open Graph tags for opportunity pages |
| **Error Handling** | Toast notifications for client errors; `error.tsx` boundaries per route group; tRPC error codes mapped to user-friendly messages |
| **Responsiveness** | Mobile-first design; all pages usable on 320px+ viewports |
| **Browser Support** | Chrome, Firefox, Safari, Edge (latest 2 versions) |

---

## 14. Environment Variables

### Current (configured in `src/env.ts`)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection (pooled) |
| `DATABASE_URL_UNPOOLED` | Neon direct connection (optional, for migrations) |
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |
| `BETTER_AUTH_SECRET` | Auth signing secret (min 32 chars) |
| `BETTER_AUTH_URL` | Auth base URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `RESEND_API_KEY` | Resend email API key |

### To Add

| Variable | Purpose |
|----------|---------|
| `UPLOADTHING_TOKEN` | UploadThing API token |
