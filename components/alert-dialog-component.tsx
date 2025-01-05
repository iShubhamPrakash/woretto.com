'use client';

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface AlertDialogComponentProps {
  isOpen?: boolean;
  message?: string;
  onClose?: () => void;
}

export function AlertDialogComponent({ isOpen = false, message = "", onClose }: AlertDialogComponentProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={() => onClose?.()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Notice</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Close</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
