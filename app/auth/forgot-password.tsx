import React, { useActionState, useEffect, useState } from 'react'
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
import { ForgotPassword } from '@/app/api/email/action';
import { ZodErrors } from '@/components/zod-errors';
import { toast } from 'sonner';
import { SonnerPromise } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { FormState } from '@/lib/models-type';

export default function ForgtoPassword({ setSigninSignup }: { setSigninSignup: React.Dispatch<React.SetStateAction<number>> }) {
  const { push } = useRouter();
  const [email, setEmail] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [stateForm, setStateForm] = useState<FormState>({ success: false, errors: {} });
  const FormSchemaSignIn = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
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
    setStateForm({ success: true, errors: {} });
    
    setLoadingSubmit(true);
    setTimeout(async () => {
      const sonnerSignIn = SonnerPromise("Sending email...", "Hang tight, we're sending the reset link to your email");
      try {
        await ForgotPassword(formData);
  
        toast.success("Check your Email!", {
          description: "We've send link reset password to your email.",
        });
        push("/");
      } catch (error: any) {
        toast.warning("Failed send Email!", {
          description: error.message,
        });
      }
      toast.dismiss(sonnerSignIn);
      setLoadingSubmit(false);
    }, 100)
  };

  return (
    <Card className="gap-5">
      <CardHeader className="text-center gap-0">
        <CardTitle className="text-xl">Forgot your Password?</CardTitle>
        <CardDescription>
          Enter your email to get your password reset link!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={(formData) => handleSubmit(formData)} className="grid gap-4">
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div>
                <Input id="email" name="email" type="text" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                {stateForm.errors?.email && <ZodErrors err={stateForm.errors?.email} />}
              </div>
            </div>
            <Button disabled={loadingSubmit} type="submit" className="w-full cursor-pointer">
              {loadingSubmit ? "Sending..." : "Send Email"}
            </Button>
          </div>

          <div className="text-center text-sm">
            <i className='bx bx-left-arrow-alt text-lg'></i> Back to&nbsp;
            <span onClick={() => setSigninSignup(1)} className="underline underline-offset-4 cursor-pointer">
              Login
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
