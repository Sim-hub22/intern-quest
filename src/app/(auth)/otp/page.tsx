import { OTPForm } from "@/components/forms/otp-form";
import { redirect } from "next/navigation";

export default async function OTPPage(props: PageProps<"/otp">) {
  const { email } = (await props.searchParams) as { email?: string };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    redirect("/signup");
  }

  return <OTPForm email={email} />;
}
