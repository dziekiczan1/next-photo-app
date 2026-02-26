import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/header/main-nav";
import { UserLoading } from "@/components/header/user-loading";

export const MobileNav = () => {
  return (
    <Sheet>
      <div className="flex items-center gap-4">
        <UserLoading />
        <ClerkLoaded>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </ClerkLoaded>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open Menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="flex flex-row items-center justify-between border-b">
          <SheetTitle>Main Menu</SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4 px-4">
          <MainNav className="flex flex-col gap-4" />
          <ClerkLoaded>
            <SignedIn>
              <Button asChild className="w-full">
                <Link href="/submit">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Submit pixel
                </Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </SheetContent>
    </Sheet>
  );
};
