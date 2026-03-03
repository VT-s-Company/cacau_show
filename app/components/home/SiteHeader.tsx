import Image from "next/image";
import Logo from "@/assets/images/logo-cacau-show.svg";

export function SiteHeader() {
  return (
    <header className="bg-primary border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-center py-3 px-4">
        <Image src={Logo} alt="Cacau Show" className="h-10.25 w-auto" />
      </div>
    </header>
  );
}
