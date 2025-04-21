"use client";

import { use, useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ZodErrors } from "@/components/zod-errors";
import { toast } from 'sonner';
import { SonnerPromise } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/app/api/auth/action';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const appName = process.env.NEXT_PUBLIC_APPS_NAME || "Cazh POS";
  const { token } = use(searchParams);
  const { push } = useRouter();

  const [stateReset, formActionSendReset, pending] = useActionState(resetPassword, {});
  const [password, setPassword] = useState('');
  const [coPassword, setCoPassword] = useState('');
  const [toggle_pass, setTogglePass] = useState(false);
  const [toggle_copass, setToggleCoPass] = useState(false);
  let sonnerSendReset: string | number;
  const handleSubmitForm = (formData: FormData) => {
    if(token === undefined || token.toString().trim() === "") {
      toast.warning("Invalid Token!", {
        description: "Looks like your token is missing. Click and try again!",
        richColors: true
      });
      return;
    }

    formData.append('token', token);
    formActionSendReset(formData);
  }

  useEffect(() => {
    toast.dismiss(sonnerSendReset);
    if (stateReset?.success === true) {
      toast.success("Password Changed!", {
        description: "Your password has been change successfully.",
        richColors: true
      });
      push("/auth");
    } else if (stateReset?.success == false && stateReset.message != null) {
      toast.warning("Request Failed!", {
        description: stateReset.message,
        richColors: true
      });
    }
  }, [stateReset]);

  useEffect(() => {
    if (pending) sonnerSendReset = SonnerPromise("Changing password...", "Wait a moment, we try to change your password");
  }, [pending]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="px-1 py-0.5 rounded-lg bg-primary text-primary-foreground">
            <i className='bx bx-shopping-bag text-3xl'></i>
          </div>
          <div className="text-xl">
            {appName}
          </div>
        </a>

        <Card className="gap-5">
          <CardHeader className="text-center gap-0">
            <CardTitle className="text-xl">Reset your Password</CardTitle>
            <CardDescription>
              Please fill out the form below to change your new password!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={(formData) => handleSubmitForm(formData)} className="grid gap-4">
              <div className="grid gap-3">
                <div className="relative w-full">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div>
                      <Input id="password" name="password" type={toggle_pass ? "text" : "password"} placeholder='***********' value={password} onChange={(e) => setPassword(e.target.value)} />
                      {stateReset.errors?.password && <ZodErrors err={stateReset.errors?.password} />}
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
                      {stateReset.errors?.co_password && <ZodErrors err={stateReset.errors?.co_password} />}
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
                  {pending ? "Changing..." : "Reset Password"}
                </Button>
              </div>

              <div className="text-center text-sm">
                <i className='bx bx-left-arrow-alt text-lg'></i> Back to&nbsp;
                <span onClick={() => push("/auth")} className="underline underline-offset-4 cursor-pointer">
                  Login
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "} and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
