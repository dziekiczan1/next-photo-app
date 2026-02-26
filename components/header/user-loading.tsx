import { ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";

import { Skeleton } from "@/components/ui/skeleton";

export const UserLoading = () => {
  return (
    <ClerkLoading>
      <SignedOut>
        <Skeleton className="h-9 w-[65px] rounded-md" />
      </SignedOut>
      <SignedIn>
        <Skeleton className="hidden lg:block h-9 w-[130px] rounded-md" />
        <Skeleton className="size-7 lg:size-9 rounded-full" />
      </SignedIn>
    </ClerkLoading>
  );
};
