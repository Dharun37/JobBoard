import Link from "next/link";

import { Button, buttonVariants } from "../ui/button";
import Image from "next/image";
import Logo from "@/public/logo.png";

import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { auth } from "@/app/utils/auth";
import { ThemeToggle } from "./ThemeToggle";
import { UserDropdown } from "./UserDropdown";
import { prisma } from "@/app/utils/db";

export async function Navbar() {
  const session = await auth();
  
  // Get user type to show appropriate navigation
  let userType = null;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true }
    });
    userType = user?.userType;
  }

  return (
    <nav className="flex justify-between items-center py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Job Board Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">
          Job<span className="text-primary">Board</span>
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
        {/* Show different navigation based on user type */}
        {session?.user && userType === "COMPANY" && (
          <>
            <Link href="/post-job" className={buttonVariants({ size: "lg" })}>
              Post Job
            </Link>
            <Link href="/job-applications" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Applications
            </Link>
            <Link href="/my-jobs" className={buttonVariants({ variant: "outline", size: "lg" })}>
              My Jobs
            </Link>
          </>
        )}
        {session?.user && userType === "JOB_SEEKER" && (
          <>
            <Link href="/favorites" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Favorites
            </Link>
            <Link href="/my-applications" className={buttonVariants({ variant: "outline", size: "lg" })}>
              My Applications
            </Link>
          </>
        )}
        {!session?.user && (
          <Link href="/post-job" className={buttonVariants({ size: "lg" })}>
            Post Job
          </Link>
        )}
        {session?.user ? (
          <UserDropdown
            email={session.user.email as string}
            name={session.user.name as string}
            image={session.user.image as string}
          />
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-4">
        <ThemeToggle />
        {session?.user ? (
          <UserDropdown
            email={session.user.email as string}
            name={session.user.name as string}
            image={session.user.image as string}
          />
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="text-left">
                <SheetTitle>
                  Job<span className="text-primary">Board</span>
                </SheetTitle>
                <SheetDescription>
                  Find or post your next job opportunity
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-6">
                <Link
                  href="/"
                  className="text-lg px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors duration-200"
                >
                  Find New Job
                </Link>
                <Link
                  href="/post-job"
                  className="text-lg px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors duration-200"
                >
                  Post a Job
                </Link>
                <Link
                  href="/login"
                  className="text-lg px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors duration-200"
                >
                  Login
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
}
