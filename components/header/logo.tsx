import Link from "next/link";
import { Sparkles } from "lucide-react";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-bold text-xl tracking-tight"
    >
      <Sparkles className="h-5 w-5 text-primary" />
      Dripixel
    </Link>
  );
};
