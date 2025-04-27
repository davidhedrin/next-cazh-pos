"use client";

import React, { JSX } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type ModalDialog = {
  title?: string;
  description?: string;
  btnOpen?: JSX.Element | string;
  children?: React.ReactNode;
};

export default function ModalDialog({
  btnOpen,
  title,
  description,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & ModalDialog) {
  const isBtnOpenJSX = React.isValidElement(btnOpen);

  return (
    <Dialog>
      <DialogTrigger asChild={isBtnOpenJSX}>
        {btnOpen ?? "Open"}
      </DialogTrigger>
      <DialogContent className={cn("p-4 gap-y-4 text-sm", className)} {...props}>
        <DialogHeader className="justify-center gap-y-0">
          <DialogTitle className="text-base">{title ?? "Modal Title"}</DialogTitle>
          {description && (<DialogDescription>{description}</DialogDescription>)}
        </DialogHeader>
        <div>
          {children ?? "Conten Here"}
        </div>
      </DialogContent>
    </Dialog>
  )
}