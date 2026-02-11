import {
  Briefcase,
  CheckSquare,
  ClipboardList,
  LayoutDashboard,
  LucideIcon,
  Users,
} from "lucide-react";

export const PUBLIC_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Internships", href: "/internships" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/#about" },
] as const;

export interface SidebarNavItem {
  label: string;
  icon: LucideIcon;
  description: string;
  href: string;
}

export const RECRUITER_NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
    href: "/dashboard",
  },
  {
    label: "Post Opportunity",
    icon: Briefcase,
    description: "Create new posting",
    href: "/post-opportunity",
  },
  {
    label: "Manage Opportunities",
    icon: ClipboardList,
    description: "View & edit postings",
    href: "/manage-opportunities",
  },
  {
    label: "View Applications",
    icon: Users,
    description: "View all applications",
    href: "/view-applications",
  },
  {
    label: "Review Quizzes",
    icon: CheckSquare,
    description: "Grade submissions",
    href: "/quiz-review",
  },
] as const satisfies Readonly<SidebarNavItem[]>;
