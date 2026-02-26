import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/header/mobile-nav";
import { UserLoading } from "@/components/header/user-loading";

export const UserNav = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden lg:flex items-center gap-3">
        <UserLoading />
        <ClerkLoaded>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn className="lg:min-w-[178px]">
            <Button asChild variant="default">
              <Link href="/submit">
                <Sparkles className="mr-2 h-4 w-4" />
                Submit Pixel
              </Link>
            </Button>
            <UserButton />
          </SignedIn>
        </ClerkLoaded>
      </div>

      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
};
