'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from './ui/button';

type AlertConfirmProps = {
  title?: string;
  description?: string;
  textClose?: string;
  textConfirm?: string;

  icon?: string;
};

type AlertDialogContextType = {
  openAlert: (props: AlertConfirmProps) => Promise<boolean>;
};

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export const UseAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('useAlertDialog must be used within an AlertDialogProvider');
  }
  return context;
};

export const AlertDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertProps, setAlertProps] = useState<AlertConfirmProps>({});
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const openAlert = (props: AlertConfirmProps) => {
    setAlertProps(props);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolver?.(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolver?.(false);
  };

  return (
    <AlertDialogContext.Provider value={{ openAlert }}>
      {children}

      {/* AlertDialog Component */}
      <AlertDialog open={isOpen} onOpenChange={handleCancel}>
        <AlertDialogContent className='w-[320px] min-w-[320px] p-4' onEscapeKeyDown={(e) => e.preventDefault()}>
          <AlertDialogHeader className="gap-y-0">
            <AlertDialogTitle className="text-base text-center">{alertProps.title || 'Confirm Title'}</AlertDialogTitle>
            {alertProps.icon && (
              <div className="text-center py-3">
                <i className={`${alertProps.icon} text-5xl`}></i>
              </div>
            )}
            {alertProps.description && <AlertDialogDescription className="text-center">{alertProps.description}</AlertDialogDescription>}
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row sm:flex-row sm:justify-center justify-center">
            <AlertDialogAction asChild>
              <Button className="primary" size="sm" onClick={handleConfirm}>{alertProps.textConfirm || "Confirm"}</Button>
            </AlertDialogAction>
            <AlertDialogCancel asChild>
              <Button variant="outline" size="sm" onClick={handleCancel}>{alertProps.textClose || "Cancel"}</Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};