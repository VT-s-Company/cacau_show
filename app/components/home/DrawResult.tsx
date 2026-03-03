"use client";

interface DrawResultProps {
  readonly onViewPrizes: () => void;
}

export default function DrawResult({ onViewPrizes }: DrawResultProps) {
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
            <div className="h-1 w-16 md:w-20 rounded-full transition-colors duration-500 bg-border"></div>
            <span className="text-xs font-medium transition-colors duration-500 text-muted-foreground">
              Prêmio
            </span>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-6 max-w-md w-full">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-accent/10 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl text-foreground font-bold">
            Participação Aprovada com Sucesso! 🎉
          </h2>
          <p className="mt-4 text-muted-foreground text-center text-sm">
            Seu desenho foi aprovado! Você desbloqueou acesso exclusivo a nossa
            loja de Páscoa.
          </p>
          <p className="mt-3 text-center text-sm">
            Ovos de Páscoa com até{" "}
            <span className="text-[#2d9b3a] font-bold">90% de desconto</span>{" "}
            esperando por você!
          </p>
        </div>

        <button
          type="button"
          onClick={onViewPrizes}
          className="group bg-primary hover:scale-102 duration-300 text-primary-foreground font-bold text-sm uppercase tracking-wider w-full py-4 rounded-xl transition-all hover:shadow-lg"
        >
          <span className="mr-2 inline-block animate-gift-sway">🎁</span>
          <span className="transition-all duration-300">Ver meus prêmios</span>
        </button>

        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span>⏳</span> Desconto válido por tempo limitado
        </p>
      </div>
    </div>
  );
}
