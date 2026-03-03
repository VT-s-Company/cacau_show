"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/assets/images/logo-cacau-show.svg";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

const STORAGE_KEY = "detailsModalLastShown";
const ONE_HOUR = 60 * 60 * 1000; // 1 hora em milissegundos
const SHOW_DELAY = 2000; // 2 segundos

export default function DetailsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica se já foi exibido recentemente
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!lastShown || now - Number(lastShown) > ONE_HOUR) {
      // Mostra o modal após alguns segundos
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, SHOW_DELAY);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
  };

  const handleParticipate = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    // Scroll suave para a área de desenho
    setTimeout(() => {
      document.querySelector("main")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full h-full sm:h-auto sm:max-w-md p-0 gap-0 overflow-y-auto [&>button]:hidden">
        <div className="sticky top-0 z-20 flex justify-end p-3 sm:absolute sm:top-0 sm:right-0 sm:p-3">
          <DialogClose asChild>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors bg-background/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-border will-change-transform"
              aria-label="Fechar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x w-5 h-5"
                aria-hidden="true"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </DialogClose>
        </div>
        <div className="flex flex-col items-center text-center px-6 pb-8 pt-2 sm:pt-4 sm:px-8 sm:pb-8 gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Image
              alt="Cacau Show"
              loading="lazy"
              width="52"
              height="14"
              decoding="async"
              data-img="1"
              className="w-12 h-auto"
              style={{ color: "transparent" }}
              src={Logo}
            />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-bold text-foreground text-lg">
                Cacau Show
              </span>
              <svg
                className="w-4 h-4 text-[#1DA1F2]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
              </svg>
            </div>
            <p className="text-muted-foreground text-sm">Loja Oficial</p>
          </div>
          <p className="text-xs tracking-[0.2em] text-muted-foreground font-semibold uppercase">
            Oferta Exclusiva
          </p>
          <h2 className="text-xl font-bold text-foreground">
            Você foi selecionado
          </h2>
          <div className="bg-primary text-primary-foreground rounded-2xl w-full py-8">
            <p className="text-5xl font-black leading-tight">
              ATE 90%
              <br />
              OFF
            </p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Complete o desafio de desenho corretamente para desbloquear seu
            cupom de desconto
          </p>
          <div className="bg-card rounded-xl p-4 w-full text-sm">
            <p className="font-bold text-foreground mb-2 text-sm">
              Como funciona:
            </p>
            <ol className="text-muted-foreground space-y-1 text-xs">
              <li>1. Desenhe o ovo de Páscoa no quadro</li>
              <li>2. Nosso sistema valida seu desenho</li>
              <li>3. Se aprovado, você libera o desconto</li>
            </ol>
          </div>
          <button
            type="button"
            onClick={handleParticipate}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm uppercase tracking-wider w-full py-4 rounded-xl transition-colors duration-150 hover:shadow-lg will-change-transform touch-manipulation"
          >
            PARTICIPAR DO DESAFIO
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pb-2">
            <span className="w-2 h-2 rounded-full bg-[#2d9b3a] animate-pulse" />
            Oferta por tempo limitado
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
