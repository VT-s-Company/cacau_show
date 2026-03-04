"use client";

import Image from "next/image";

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
  readonly drawingPreviewUrl?: string | null;
}

export function ConfirmDrawingModal({
  open,
  onOpenChange,
  onConfirm,
  drawingPreviewUrl,
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

        <div className="mx-4 rounded-lg border border-border bg-background p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Prévia do seu desenho
          </p>
          <div className="rounded-md border border-dashed border-border min-h-40 flex items-center justify-center overflow-hidden bg-white">
            {drawingPreviewUrl ? (
              <Image
                src={drawingPreviewUrl}
                alt="Prévia do desenho"
                width={320}
                height={208}
                className="max-h-52 w-auto object-contain bg-white"
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                Nenhum traço detectado ainda.
              </span>
            )}
          </div>
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
