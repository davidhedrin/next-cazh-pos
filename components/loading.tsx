"use client";

import { useLoading } from "@/contexts/loading-context";

export default function Loading() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-1">
        <i className='bx bx-shopping-bag bx-tada text-3xl'></i>
        <p className='text-sm font-medium'>Cazh POS...</p>
      </div>
    </div>
  )
}