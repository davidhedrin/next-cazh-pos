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

export default function ForgtoPassword({ setSigninSignup }: { setSigninSignup: React.Dispatch<React.SetStateAction<number>> }) {
  const { push } = useRouter();
  const [stateEmail, formActionSendEmail, pending] = useActionState(ForgotPassword, {});
  const [email, setEmail] = useState('');
  let sonnerSendEmail: string | number;

  useEffect(() => {
    toast.dismiss(sonnerSendEmail);
    if (stateEmail?.success === true) {
      toast.success("Check your Email!", {
        description: "We've send link reset password to your email.",
        richColors: true
      });
      push("/");
    } else if (stateEmail?.success == false && stateEmail.message != null) {
      toast.warning("Failed send Email!", {
        description: stateEmail.message,
        richColors: true
      });
    }
  }, [stateEmail]);

  useEffect(() => {
    if (pending) sonnerSendEmail = SonnerPromise("Sending email...", "Hang tight, we're sending the reset link to your email");
  }, [pending]);

  return (
    <Card className="gap-5">
      <CardHeader className="text-center gap-0">
        <CardTitle className="text-xl">Forgot your Password?</CardTitle>
        <CardDescription>
          Enter your email to get your password reset link!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formActionSendEmail} className="grid gap-4">
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div>
                <Input id="email" name="email" type="text" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                {stateEmail.errors?.email && <ZodErrors err={stateEmail.errors?.email} />}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Send Email
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
