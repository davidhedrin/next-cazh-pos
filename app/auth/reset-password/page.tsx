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
import { z } from "zod";
import { FormState } from "@/lib/models-type";

export default function ResetPassword({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const appName = process.env.NEXT_PUBLIC_APPS_NAME || "Cazh POS";
  const { push } = useRouter();
  const { token } = use(searchParams);

  const [password, setPassword] = useState('');
  const [coPassword, setCoPassword] = useState('');
  const [toggle_pass, setTogglePass] = useState(false);
  const [toggle_copass, setToggleCoPass] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [stateForm, setStateForm] = useState<FormState>({ success: false, errors: {} });
  const FormSchemaChangePass = z.object({
    password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim(),
    co_password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim()
  }).refine((data) => data.password === data.co_password, {
    message: "Confirmation password don't match",
    path: ["co_password"]
  });

  const handleSubmitForm = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const valResult = FormSchemaChangePass.safeParse(data);
    if (!valResult.success) {
      setStateForm({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateForm({ success: true, errors: {} });

    if (token === undefined || token.toString().trim() === "") {
      toast.warning("Invalid Token!", {
        description: "Looks like your token is missing. Click and try again!",
      });
      return;
    }
    
    setLoadingSubmit(true);
    setTimeout(async () => {
      const sonnerSignIn = SonnerPromise("Changing password...", "Wait a moment, we try to change your password");
      try {
        formData.append('token', token);
        await resetPassword(formData);
  
        toast.success("Password Changed!", {
          description: "Your password has been change successfully.",
        });
        push("/auth");
      } catch (error: any) {
        toast.warning("Request Failed!", {
          description: error.message,
        });
      }
      toast.dismiss(sonnerSignIn);
      setLoadingSubmit(false);
    }, 100)
  };

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
                      {stateForm.errors?.password && <ZodErrors err={stateForm.errors?.password} />}
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
                      {stateForm.errors?.co_password && <ZodErrors err={stateForm.errors?.co_password} />}
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
                <Button disabled={loadingSubmit} type="submit" className="w-full mt-2">
                  {loadingSubmit ? "Changing..." : "Reset Password"}
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
