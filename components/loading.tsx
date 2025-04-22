import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-white/60 dark:bg-black/40">
      <div className="flex flex-col items-center space-y-1">
        <i className='bx bx-shopping-bag bx-tada text-3xl'></i>
        <p className='text-sm font-medium'>Cazh POS...</p>
      </div>
    </div>
  )
}
