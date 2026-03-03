"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface DrawFlowContextType {
  isAnalyzing: boolean;
  showResult: boolean;
  showPrize: boolean;
  progress: number;
  setIsAnalyzing: Dispatch<SetStateAction<boolean>>;
  setShowResult: Dispatch<SetStateAction<boolean>>;
  setShowPrize: Dispatch<SetStateAction<boolean>>;
  setProgress: Dispatch<SetStateAction<number>>;
}

const DrawFlowContext = createContext<DrawFlowContextType | undefined>(
  undefined,
);

export function DrawFlowProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [progress, setProgress] = useState(0);

  const value = useMemo(
    () => ({
      isAnalyzing,
      showResult,
      showPrize,
      progress,
      setIsAnalyzing,
      setShowResult,
      setShowPrize,
      setProgress,
    }),
    [isAnalyzing, showResult, showPrize, progress],
  );

  return (
    <DrawFlowContext.Provider value={value}>
      {children}
    </DrawFlowContext.Provider>
  );
}

export function useDrawFlow() {
  const context = useContext(DrawFlowContext);
  if (!context) {
    throw new Error("useDrawFlow must be used within DrawFlowProvider");
  }
  return context;
}
