import {
  Briefcase,
  CheckSquare,
  ClipboardList,
  LayoutDashboard,
  LucideIcon,
  Users,
} from "lucide-react";
import { Route } from "next";

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
  href: Route;
}

export const RECRUITER_NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
    href: "/recruiter/dashboard",
  },
  {
    label: "Post Opportunity",
    icon: Briefcase,
    description: "Create new posting",
    href: "/recruiter/post-opportunity",
  },
  {
    label: "Manage Opportunities",
    icon: ClipboardList,
    description: "View & edit postings",
    href: "/recruiter/manage-opportunities",
  },
  {
    label: "View Applications",
    icon: Users,
    description: "View all applications",
    href: "/recruiter/view-applications",
  },
  {
    label: "Review Quizzes",
    icon: CheckSquare,
    description: "Grade submissions",
    href: "/recruiter/quiz-review",
  },
] as const satisfies Readonly<SidebarNavItem[]>;
