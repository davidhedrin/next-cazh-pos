"use client";

import React, { useState } from 'react'

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
import { signInGoogle, signInCredential } from '../api/auth/action';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { SonnerPromise } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { FormState } from '@/lib/models-type';

import { z } from 'zod';

export default function AuthSignin({ setSigninSignup }: { setSigninSignup: React.Dispatch<React.SetStateAction<number>> }) {
  const { push } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggle_pass, setTogglePass] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [stateForm, setStateForm] = useState<FormState>({success: false, errors: {}});
  const FormSchemaSignIn = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim(),
  });
  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const valResult = FormSchemaSignIn.safeParse(data);
    if (!valResult.success) {
      setStateForm({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };

    setStateForm({success: true, errors: {}});
    const sonnerSignIn = SonnerPromise("Signing you in...", "Please wait to Authenticating your credentials");
    setLoadingSubmit(true);
    try {
      await signInCredential(formData);
      
      toast.success("Login successfully!", {
        description: `Welcome back ${email}`,
      });
      push("/apps/dashboard");
    } catch (error: any) {
      toast.warning("Invalid credentials!", {
        description: error.message,
      });
    }
    toast.dismiss(sonnerSignIn);
    setLoadingSubmit(false);
  };

  return (
    <Card className="gap-5">
      <CardHeader className="text-center gap-0">
        <CardTitle className="text-xl">Welcome to System</CardTitle>
        <CardDescription>
          Login with your Facebook or Google account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 mb-3">
          <Button variant="outline" className="w-full">
            <i className='bx bxl-facebook-square text-xl'></i>
            Login with Facebook
          </Button>
          <Button onClick={signInGoogle} type="submit" variant="outline" className="w-full">
            <i className='bx bxl-google text-xl'></i>
            Login with Google
          </Button>
        </div>
        <div className="mb-2 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <form action={(formData) => handleSubmit(formData)} className="grid gap-4">
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div>
                <Input id="email" name="email" type="text" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                {stateForm.errors?.email && <ZodErrors err={stateForm.errors?.email} />}
              </div>
            </div>
            <div className="relative w-full">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <div onClick={() => setSigninSignup(3)} className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer">
                    Forgot your password?
                  </div>
                </div>
                <div>
                  <Input id="password" name="password" type={toggle_pass ? "text" : "password"} placeholder='***********' value={password} onChange={(e) => setPassword(e.target.value)} />
                  {stateForm.errors?.password && <ZodErrors err={stateForm.errors?.password} />}
                </div>
              </div>
              <a
                href='#'
                className="absolute right-2 top-9 text-muted-foreground hover:text-foreground"
                onClick={() => setTogglePass((prev) => !prev)}
                tabIndex={-1}
              >
                {toggle_pass ? <EyeOff size={18} /> : <Eye size={18} />}
              </a>
            </div>
            <Button disabled={loadingSubmit} type="submit" className="w-full mt-2 cursor-pointer">
              {loadingSubmit ? "Logging in..." : "Login"}
            </Button>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?&nbsp;
            <span onClick={() => setSigninSignup(2)} className="underline underline-offset-4 cursor-pointer">
              Sign up
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}