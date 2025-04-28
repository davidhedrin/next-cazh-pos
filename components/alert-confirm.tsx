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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import React, { JSX } from "react";

type AlertConfirmProps = {
  title?: string;
  description?: string;
  textClose?: string;
  textConfirm?: string;
  btnOpen?: JSX.Element | string;
  icon?: JSX.Element | string;

  id: number | string;
  deleteRow: (id: number | string) => Promise<void>;
};

export function AlertConfirm({
  btnOpen,
  title,
  description,
  textClose,
  textConfirm,
  icon,

  id,
  deleteRow,

  className,
  ...props
}: React.ComponentProps<"div"> & AlertConfirmProps) {
  const isBtnOpenJSX = React.isValidElement(btnOpen);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={isBtnOpenJSX}>
        {btnOpen ?? "Open"}
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("p-4 text-sm", className)} {...props}>
        <AlertDialogHeader className="gap-y-0">
          <AlertDialogTitle className="text-base text-center">{title ?? "Confirm Title"}</AlertDialogTitle>
          {icon && <div className="text-center py-3">{icon}</div>}
          {description && <AlertDialogDescription className="text-center">{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row sm:flex-row sm:justify-center justify-center">
          <AlertDialogAction asChild>
            <Button onClick={() => deleteRow(id)} className="primary" size={"sm"}>{textConfirm ?? "Confirm"}</Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button variant={"outline"} size={"sm"}>{textClose ?? "Cancel"}</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}