"use client";

interface AnalyzeWaitProps {
  readonly progress: number;
}

export default function AnalyzeWait({ progress }: AnalyzeWaitProps) {
  return (
    <div className="flex flex-col items-center py-12 px-4">
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
            <div className="h-1 w-16 md:w-20 rounded-full transition-colors duration-500 bg-border"></div>
            <span className="text-xs font-medium transition-colors duration-500 text-muted-foreground">
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
          <div className="absolute inset-0 rounded-full border-4 border-border"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"
            style={{ animationDuration: "1s" }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-serif text-foreground font-bold">
            Analisando seu desenho
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Comparando com modelo...
          </p>
        </div>
        <div className="w-full bg-border rounded-full h-3 overflow-hidden">
          <div
            className="bg-accent h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground">{progress}% concluído</p>
      </div>
    </div>
  );
}
