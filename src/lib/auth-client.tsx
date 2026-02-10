"use client";

import { Button } from "@/components/ui/button";
import type { auth } from "@/server/auth";
import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
    adminClient(),
  ],
});

export function Authenticated({ children }: PropsWithChildren) {
  const { data, isPending } = authClient.useSession();
  if (isPending || !data?.user) return null;

  return <>{children}</>;
}

export function Unauthenticated({ children }: PropsWithChildren) {
  const { data, isPending } = authClient.useSession();
  if (isPending || data?.user) return null;
  return <>{children}</>;
}

export function LoginButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button {...props} asChild>
      <Link href="/login">{props.children ?? "Login"}</Link>
    </Button>
  );
}

export function SignupButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button {...props} asChild>
      <Link href="/signup">{props.children ?? "Get Started"}</Link>
    </Button>
  );
}
