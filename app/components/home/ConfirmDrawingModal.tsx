"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDrawingModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: () => void;
}

export function ConfirmDrawingModal({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDrawingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 border-none!">
        <DialogHeader className="bg-primary rounded-t-lg p-6 border-none!">
          <DialogTitle className="text-2xl font-serif text-white">
            Seu desenho está correto?
          </DialogTitle>
          <DialogDescription className="text-white/60 pt-2">
            Você está prestes a enviar seu desenho do ovo de Páscoa para
            análise. Certifique-se de que está satisfeito com o resultado antes
            de continuar.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20 mx-4">
          <p className="text-sm text-foreground">
            🎨 <strong>Lembre-se:</strong> Quanto mais criativo e caprichado for
            seu desenho, maiores as chances de ganhar prêmios especiais!
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mx-4 mb-6">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border-2 border-border text-foreground font-semibold hover:bg-secondary transition-all"
          >
            Continuar desenhando
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 rounded-lg transition-all hover:shadow-lg"
          >
            Sim, enviar desenho
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
