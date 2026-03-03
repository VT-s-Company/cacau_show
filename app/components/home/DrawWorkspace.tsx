const colors = [
  { title: "Marrom", value: "rgb(90, 56, 37)", selected: true },
  { title: "Chocolate", value: "rgb(139, 69, 19)" },
  { title: "Dourado", value: "rgb(212, 160, 74)" },
  { title: "Vermelho", value: "rgb(229, 57, 53)" },
  { title: "Laranja", value: "rgb(255, 111, 0)" },
  { title: "Amarelo", value: "rgb(255, 214, 0)" },
  { title: "Verde", value: "rgb(45, 155, 58)" },
  { title: "Azul", value: "rgb(25, 118, 210)" },
  { title: "Rosa", value: "rgb(233, 30, 125)" },
  { title: "Roxo", value: "rgb(123, 31, 162)" },
  { title: "Branco", value: "rgb(255, 255, 255)" },
  { title: "Preto", value: "rgb(33, 33, 33)" },
];

const brushSizes = [
  { label: "P", selected: false },
  { label: "M", selected: true },
  { label: "G", selected: false },
];

export function DrawWorkspace() {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-center gap-4 px-4 w-full max-w-3xl mx-auto">
      <div className="bg-card rounded-2xl shadow-lg border border-border p-3 flex-shrink-0">
        <div className="relative" style={{ width: "420px", height: "470px" }}>
          <canvas
            width="420"
            height="470"
            className="absolute inset-0 rounded-xl bg-background pointer-events-none"
            style={{ width: "420px", height: "470px" }}
          ></canvas>
          <canvas
            width="420"
            height="470"
            className="absolute inset-0 rounded-xl cursor-crosshair touch-none"
            style={{ width: "420px", height: "470px" }}
          ></canvas>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-lg border border-border p-4 sm:p-3 w-full sm:w-auto flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Cores
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-2 gap-2">
            {colors.map((color) => (
              <button
                key={color.title}
                title={color.title}
                className={`w-9 h-9 rounded-lg border-2 transition-all duration-150 hover:scale-110 ${
                  color.selected
                    ? "border-foreground ring-2 ring-accent/50 scale-110"
                    : "border-border"
                }`}
                aria-label={`Cor ${color.title}`}
                style={{ backgroundColor: color.value }}
              ></button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Pincel
          </p>
          <div className="flex sm:flex-col gap-2">
            {brushSizes.map((brush) => (
              <button
                key={brush.label}
                className={`flex items-center justify-center w-9 h-9 rounded-lg border-2 transition-all text-xs font-bold ${
                  brush.selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-secondary"
                }`}
                aria-label={`Tamanho do pincel ${brush.label}`}
              >
                {brush.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex sm:flex-col gap-2">
          <button
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 text-xs font-semibold transition-all border-border text-muted-foreground hover:bg-secondary"
            aria-label="Borracha"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            Borracha
          </button>
          <button
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 border-destructive/30 text-destructive text-xs font-semibold hover:bg-destructive/10 transition-all"
            aria-label="Limpar tudo"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
