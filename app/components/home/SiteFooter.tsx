import Image from "next/image";
import Selo from "@/assets/images/Selo-RA1000-pneubest.jpg";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-1">
          <p className="font-semibold text-sm">
            © 2026 Cacau Show • Todos os direitos reservados
          </p>
          <p className="text-xs opacity-70">
            CNPJ: 03.816.961/0001-40 — Cacau Show Ltda.
          </p>
          <p className="text-xs opacity-70">
            Loja Cacau Show licenciada pela empresa TikTok
          </p>
        </div>
        <div className="shrink-0 rounded-md overflow-hidden">
          <Image
            src={Selo}
            alt="Certificado RA1000 Reclame Aqui"
            className="w-auto h-30"
          />
        </div>
      </div>
    </footer>
  );
}
