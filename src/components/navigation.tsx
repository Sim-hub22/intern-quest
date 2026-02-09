import { AuthenticationActions } from "@/components/authentication-actions";
import { Logo } from "@/components/logo";
import { NavigationButton } from "@/components/navigation-button";
import { MENU_ITEMS } from "@/const/navigation";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

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
