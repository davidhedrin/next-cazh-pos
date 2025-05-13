"use client";

import { useLoading } from "@/contexts/loading-context";
import Image from "next/image";
import { useEffect } from "react";

export default function AccessDenied() {
  const { setLoading } = useLoading();
  useEffect(() => {
    setLoading(false);
  });

  return (
    <div className="flex min-h-[calc(110vh-10rem)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <Image
          src="/assets/img/access-denied.png"
          alt="Access Denied"
          width={400}
          height={400}
        />

        <div className="pt-5 pb-1">
          <i className="bx bx-lock bx-tada text-6xl mb-1"></i>
          <div className="text-xl mb-8">403 - Access Denied</div>
          <div>Sorry! Page not found.</div>
          <p className="text-sm text-muted-foreground">
            You do not have permission to access this page.
            <br />
            If you believe this is an error, please contact the administrator.
          </p>
        </div>
      </div>
    </div>
  )
}