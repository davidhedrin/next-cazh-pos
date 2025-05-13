import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Image from 'next/image';

export default function NotFound() {
  const appName = process.env.NEXT_PUBLIC_APPS_NAME || "Cazh POS";
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-5">
      <div className="flex w-full items-center max-w-sm flex-col gap-4">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="px-1 py-0.5 rounded-lg bg-primary text-primary-foreground">
            <i className='bx bx-shopping-bag text-3xl'></i>
          </div>
          <div className="text-xl">
            {appName}
          </div>
        </a>

        <Image
          className='pt-5'
          src="/assets/img/page-not-found2.png"
          alt="Page Not Found"
          width={300}
          height={300}
        />

        <div className="flex flex-col gap-4 text-balance text-center">
          <div className='pt-3 pb-1'>
            <i className='bx bx-bug bx-tada text-6xl mb-1'></i>
            <div className='text-xl mb-8'>404 - Error</div>
            <div>
              Sorry! Page not found.
            </div>
            <p className='text-sm text-muted-foreground'>
              The link you clicked may be broken or the page may have been remove. Back to home by click the button bellow.
            </p>
          </div>
          <div>
            <Link href={"/"}>
              <Button variant={'outline'}>Back To Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}