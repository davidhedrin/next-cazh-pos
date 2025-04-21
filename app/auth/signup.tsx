"use client";

import React, { useActionState, useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ZodErrors } from "@/components/zod-errors";

import { signUpAction } from "../api/auth/action";
import { SonnerPromise } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthSignup({ setSigninSignup }: { setSigninSignup: React.Dispatch<React.SetStateAction<number>> }) {
  const { push } = useRouter();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [coPassword, setCoPassword] = useState('');
  const [toggle_pass, setTogglePass] = useState(false);
  const [toggle_copass, setToggleCoPass] = useState(false);
  const [state, formActionSignUp, pending] = useActionState(signUpAction, {});
  let sonnerSignUp: string | number;
  useEffect(() => {
    toast.dismiss(sonnerSignUp);
    if (state?.success) {
      toast.success("Account created successfully!", {
        description: "Welcome aboard!. Let's get started!",
        richColors: true
      });
      push("/dashboard");
    }
  }, [state]);

  useEffect(() => {
    if (pending) sonnerSignUp = SonnerPromise("Creating your account...", "Please wait, we're creating your account!");
  }, [pending]);

  return (
    <Card className="gap-5">
      <CardHeader className="text-center gap-0">
        <CardTitle className="text-xl">Create Account</CardTitle>
        <CardDescription>
          Let's get started with create an new account!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formActionSignUp} className="grid gap-4">
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Fullname</Label>
              <div>
                <Input id="fullname" name="fullname" type="text" placeholder="Ex. John Thor Doe" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                {state.errors?.fullname && <ZodErrors err={state.errors?.fullname} />}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div>
                <Input id="email" name="email" type="text" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                {state.errors?.email && <ZodErrors err={state.errors?.email} />}
              </div>
            </div>
            <div className="relative w-full">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div>
                  <Input id="password" name="password" type={toggle_pass ? "text" : "password"} placeholder='***********' value={password} onChange={(e) => setPassword(e.target.value)} />
                  {state.errors?.password && <ZodErrors err={state.errors?.password} />}
                </div>
              </div>
              <a
                href='#'
                className="absolute right-2 top-8 text-muted-foreground hover:text-foreground"
                onClick={() => setTogglePass((prev) => !prev)}
                tabIndex={-1}
              >
                {toggle_pass ? <EyeOff size={18} /> : <Eye size={18} />}
              </a>
            </div>
            <div className="relative w-full">
              <div className="grid gap-2">
                <Label htmlFor="co_password">Confirm Password</Label>
                <div>
                  <Input id="co_password" name="co_password" type={toggle_copass ? "text" : "password"} placeholder='***********' value={coPassword} onChange={(e) => setCoPassword(e.target.value)} />
                  {state.errors?.co_password && <ZodErrors err={state.errors?.co_password} />}
                </div>
              </div>
              <a
                href='#'
                className="absolute right-2 top-8 text-muted-foreground hover:text-foreground"
                onClick={() => setToggleCoPass((prev) => !prev)}
                tabIndex={-1}
              >
                {toggle_copass ? <EyeOff size={18} /> : <Eye size={18} />}
              </a>
            </div>
            <Button disabled={pending} type="submit" className="w-full mt-2">
              {pending ? "Submitting..." : "Register"}
            </Button>
          </div>
          <div className="text-center text-sm">
            Already have an account?&nbsp;
            <span onClick={() => setSigninSignup(1)} className="underline underline-offset-4 cursor-pointer">
              Sign in
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
