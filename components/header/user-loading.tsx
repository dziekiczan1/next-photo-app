import { ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";

import { Skeleton } from "@/components/ui/skeleton";

export const UserLoading = () => {
  return (
    <ClerkLoading>
      <SignedOut>
        <Skeleton className="h-9 w-[136px] rounded-md" />
      </SignedOut>
      <SignedIn>
        <Skeleton className="h-9 w-[130px] rounded-md" />
        <Skeleton className="size-9 rounded-full" />
      </SignedIn>
    </ClerkLoading>
  );
};
