"use client";

import { useEffect, useState } from "react";
import { Confetti } from "@/components/ui/confetti";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductsStore from "./ProductsStore";

export default function DrawPrize() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showStore, setShowStore] = useState(false);

  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true);
    }, 1400);

    const couponTimer = setTimeout(() => {
      setShowCoupon(true);
    }, 2200);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(couponTimer);
    };
  }, []);

  const showProducts = () => {
    setShowCoupon(false);
    setShowStore(true);
  };

  if (showStore) {
    return <ProductsStore />;
  }

  return (
    <div className="flex flex-col items-center pb-8 px-4">
      <div className="flex items-center justify-center gap-2 py-6">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="h-1 w-16 md:w-20 rounded-full transition-colors duration-500 bg-accent"></div>
            <span className="text-xs font-medium transition-colors duration-500 text-foreground">
              Desenhe
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="h-1 w-16 md:w-20 rounded-full transition-colors duration-500 bg-accent"></div>
            <span className="text-xs font-medium transition-colors duration-500 text-foreground">
              Analise
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="h-1 w-16 md:w-20 rounded-full transition-colors duration-500 bg-accent"></div>
            <span className="text-xs font-medium transition-colors duration-500 text-foreground">
              Resultado
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="h-1 w-16 md:w-20 rounded-full transition-colors duration-500 bg-accent"></div>
            <span className="text-xs font-medium transition-colors duration-500 text-foreground">
              Prêmio
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6 max-w-md w-full relative">
        {showConfetti && (
          <Confetti
            className="pointer-events-none fixed inset-0 z-50 h-screen w-screen"
            options={{
              particleCount: 100,
              spread: 200,
              startVelocity: 20,
              ticks: 300,
              decay: 0.9,
              origin: { x: 0.5, y: 0.4 },
              colors: ["#5a3825", "#d4a04a", "#8a7262", "#e53935", "#2d9b3a"],
            }}
          />
        )}

        <div className="relative h-96 w-96 flex items-center justify-center">
          <DotLottieReact
            loop
            src="/assets/animations/gift_open.lottie"
            autoplay
          />
        </div>

        <Dialog open={showCoupon} onOpenChange={setShowCoupon}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-foreground">
                Seu prêmio chegou! 🎉
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Cupom liberado com sucesso.
              </p>

              <div className="rounded-2xl border-2 border-dashed border-accent bg-card p-6 text-center shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Cupom Exclusivo
                </p>
                <p className="mt-2 text-4xl font-black text-accent">90% OFF</p>
                <p className="mt-2 text-sm text-foreground">
                  Código: <span className="font-bold">PASCOA90</span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Válido por tempo limitado.
                </p>
              </div>

              <button
                type="button"
                onClick={showProducts}
                className="group bg-primary hover:scale-102 duration-300 text-primary-foreground font-bold text-sm uppercase tracking-wider w-full py-4 rounded-xl transition-all hover:shadow-lg"
              >
                <span className="mr-2 inline-block animate-gift-sway">🎁</span>
                <span className="transition-all duration-300">
                  Ver meus prêmios
                </span>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
