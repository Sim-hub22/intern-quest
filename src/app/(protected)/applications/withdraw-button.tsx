"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { trpcClient } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface WithdrawButtonProps {
  applicationId: string;
}

export function WithdrawButton({ applicationId }: WithdrawButtonProps) {
  const router = useRouter();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      await trpcClient.application.withdraw.mutate({ id: applicationId });
      toast.success("Application withdrawn successfully");
      router.refresh(); // Refresh to update the list
    } catch (error: any) {
      toast.error(error.message || "Failed to withdraw application");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isWithdrawing}>
          Withdraw
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to withdraw this application? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleWithdraw} disabled={isWithdrawing}>
            {isWithdrawing ? "Withdrawing..." : "Withdraw"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
