import { MainNav } from "@/components/header/main-nav";
import { Logo } from "@/components/header/logo";
import { UserNav } from "@/components/header/user-nav";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto">
        <Logo />
        <MainNav className="hidden lg:flex items-center gap-8" />
        <UserNav />
      </div>
    </header>
  );
};
