"use client";

import { useState, useEffect } from "react";
import { ConfirmDrawingModal } from "./ConfirmDrawingModal";
import AnalyzeWait from "./AnalyzeWait";
import DrawResult from "./DrawResult";
import DrawPrize from "./DrawPrize";
import { useDrawFlow } from "./DrawFlowContext";

export function SubmitSection() {
  const [minutes, setMinutes] = useState(29);
  const [seconds, setSeconds] = useState(30);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isAnalyzing,
    showResult,
    showPrize,
    progress,
    setIsAnalyzing,
    setShowResult,
    setShowPrize,
    setProgress,
  } = useDrawFlow();

  useEffect(() => {
    const savedTime = localStorage.getItem("timerExpiry");
    const expiryTime = savedTime
      ? Number.parseInt(savedTime)
      : Date.now() + 29 * 60000 + 30 * 1000;

    if (!savedTime) {
      localStorage.setItem("timerExpiry", expiryTime.toString());
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, expiryTime - Date.now());
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);

      setMinutes(mins);
      setSeconds(secs);

      if (remaining === 0) {
        clearInterval(interval);
        localStorage.removeItem("timerExpiry");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Controla o progresso da análise
  useEffect(() => {
    if (!isAnalyzing) return;

    const duration = 5000; // 5 segundos para completar
    const steps = 100;
    const stepDuration = duration / steps;

    const progressInterval = setInterval(() => {
      setProgress((prev: number) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(progressInterval);
  }, [isAnalyzing, setProgress]);

  // Quando a análise terminar, mostra o resultado
  useEffect(() => {
    if (progress >= 100 && isAnalyzing) {
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true);
      }, 500); // Pequeno delay para suavizar a transição

      return () => clearTimeout(timer);
    }
  }, [progress, isAnalyzing, setIsAnalyzing, setShowResult]);

  const handleConfirm = () => {
    setIsModalOpen(false);
    setProgress(0);
    setShowResult(false);
    setShowPrize(false);
    setIsAnalyzing(true);
  };

  const handleViewPrizes = () => {
    setShowResult(false);
    setShowPrize(true);
  };

  if (showPrize) {
    return <DrawPrize />;
  }

  // Se está mostrando resultado
  if (showResult) {
    return <DrawResult onViewPrizes={handleViewPrizes} />;
  }

  // Se está analisando, mostra o componente de análise
  if (isAnalyzing) {
    return <AnalyzeWait progress={progress} />;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-6 px-4 w-full max-w-md">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm uppercase tracking-wider w-full py-4 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ENVIAR DESENHO
        </button>
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-5 py-3 shadow-sm">
          <span className="text-destructive text-sm font-medium">
            ⏳ EXPIRA EM
          </span>
          <div className="flex items-center gap-1">
            <div className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 font-bold text-lg tabular-nums min-w-11 text-center">
              {String(minutes).padStart(2, "0")}
            </div>
            <span className="text-foreground font-bold text-lg">:</span>
            <div className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 font-bold text-lg tabular-nums min-w-11 text-center">
              {String(seconds).padStart(2, "0")}
            </div>
          </div>
          <div className="flex gap-4 text-[10px] text-muted-foreground -mt-1">
            <span className="ml-1">Min</span>
            <span className="ml-2">Seg</span>
          </div>
        </div>
      </div>

      <ConfirmDrawingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleConfirm}
      />
    </>
  );
}
