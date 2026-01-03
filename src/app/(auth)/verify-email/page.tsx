import { VerifyEmailOTPForm } from "@/components/forms/verify-email-otp-form";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage(
  props: PageProps<"/verify-email">
) {
  const { email } = (await props.searchParams) as { email?: string };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    redirect("/signup");
  }

  return <VerifyEmailOTPForm email={email} />;
}
