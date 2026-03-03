const steps = [
  { label: "Desenhe", active: true },
  { label: "Analise", active: false },
  { label: "Resultado", active: false },
  { label: "Premio", active: false },
];

export function DrawSteps() {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {steps.map((step) => (
        <div className="flex items-center gap-2" key={step.label}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`h-1 w-16 md:w-20 rounded-full transition-colors duration-500 ${
                step.active ? "bg-accent" : "bg-border"
              }`}
            ></div>
            <span
              className={`text-xs font-medium transition-colors duration-500 ${
                step.active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
