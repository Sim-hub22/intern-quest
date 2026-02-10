"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function LogoutAlertDialog(
  props: React.ComponentProps<typeof AlertDialog>,
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Something went wrong. Please try again.");
        return;
      }

      router.push("/");
    });
  };

  return (
    <AlertDialog {...props}>
      <AlertDialogContent size="sm" className="min-w-md">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive rounded-full">
            <TriangleAlert />
          </AlertDialogMedia>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out of your account and redirected to the home
            page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
