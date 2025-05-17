"use client"

import React, { useState } from 'react'
import AuthSignin from './signin'
import AuthSignup from './signup';
import ForgotPassword from './forgot-password';

export default function AuthPage() {
  const appName = process.env.NEXT_PUBLIC_APPS_NAME || "Cazh POS";
  const [signinSignup, setSigninSignup] = useState(1);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="px-1 py-0.5 rounded-lg bg-orange-600 text-sidebar-primary-foreground">
            <i className='bx bx-shopping-bag text-3xl'></i>
          </div>
          <div className="text-xl text-orange-600">
            {appName}
          </div>
        </a>

        { signinSignup == 1 && <AuthSignin setSigninSignup={setSigninSignup} /> }
        { signinSignup == 2 && <AuthSignup setSigninSignup={setSigninSignup} /> }
        { signinSignup == 3 && <ForgotPassword setSigninSignup={setSigninSignup} /> }
        
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "} and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
