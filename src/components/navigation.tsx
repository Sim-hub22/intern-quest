import { AuthenticationActions } from "@/components/authentication-actions";
import { NavigationButton } from "@/components/navigation-button";
import { MENU_ITEMS } from "@/const/navigation";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  IQ
                </span>
              </div>
              <span className="text-foreground">InternQuest</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {MENU_ITEMS.map((item) => (
              <NavigationButton
                key={item.href}
                href={item.href}
                label={item.label}
              />
            ))}
          </div>

          <AuthenticationActions />
        </div>
      </div>
    </nav>
  );
}
