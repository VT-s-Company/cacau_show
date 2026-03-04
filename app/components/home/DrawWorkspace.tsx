"use client";

import { useEffect, useRef, useState } from "react";
import { useDrawFlow } from "./DrawFlowContext";

const CANVAS_WIDTH = 420;
const CANVAS_HEIGHT = 470;

const colors = [
  { title: "Marrom", value: "rgb(90, 56, 37)" },
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
  { label: "P", size: 4 },
  { label: "M", size: 8 },
  { label: "G", size: 14 },
];

export function DrawWorkspace() {
  const templateCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [selectedBrushSize, setSelectedBrushSize] = useState(
    brushSizes[1].size,
  );
  const [isEraserMode, setIsEraserMode] = useState(false);
  const { setDrawingPreviewUrl } = useDrawFlow();

  useEffect(() => {
    const templateCanvas = templateCanvasRef.current;
    if (!templateCanvas) return;

    const templateContext = templateCanvas.getContext("2d");
    if (!templateContext) return;

    const img = new Image();
    img.src = "/assets/images/ovo-molde.jpg";
    img.crossOrigin = "anonymous";

    img.onload = () => {
      templateContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      templateContext.globalAlpha = 0.5;
      templateContext.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      templateContext.globalAlpha = 1;
    };
  }, []);

  const hasDrawing = () => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return false;

    const context = drawCanvas.getContext("2d");
    if (!context) return false;

    const pixels = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] !== 0) {
        return true;
      }
    }
    return false;
  };

  const updatePreview = () => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;

    if (!hasDrawing()) {
      setDrawingPreviewUrl(null);
      return;
    }

    setDrawingPreviewUrl(drawCanvas.toDataURL("image/png"));
  };

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const drawLine = (
    from: { x: number; y: number },
    to: { x: number; y: number },
  ) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.globalCompositeOperation = isEraserMode
      ? "destination-out"
      : "source-over";
    context.strokeStyle = selectedColor;
    context.lineWidth = selectedBrushSize;
    context.lineCap = "round";
    context.lineJoin = "round";

    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  };

  const drawDot = (point: { x: number; y: number }) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.globalCompositeOperation = isEraserMode
      ? "destination-out"
      : "source-over";
    context.fillStyle = selectedColor;

    context.beginPath();
    context.arc(point.x, point.y, selectedBrushSize / 2, 0, Math.PI * 2);
    context.fill();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getPoint(event);
    if (!point) return;

    isDrawingRef.current = true;
    lastPointRef.current = point;
    drawDot(point);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    const currentPoint = getPoint(event);
    const previousPoint = lastPointRef.current;
    if (!currentPoint || !previousPoint) return;

    drawLine(previousPoint, currentPoint);
    lastPointRef.current = currentPoint;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    updatePreview();
  };

  const handleClear = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setDrawingPreviewUrl(null);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start justify-center gap-4 px-4 w-full max-w-3xl mx-auto">
      <div className="bg-card rounded-2xl shadow-lg border border-border p-3 shrink-0">
        <div
          className="relative bg-white rounded-xl"
          style={{ width: "420px", height: "470px" }}
        >
          <canvas
            ref={templateCanvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ width: "420px", height: "470px" }}
          />
          <canvas
            ref={drawCanvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="absolute inset-0 rounded-xl cursor-crosshair touch-none"
            style={{ width: "420px", height: "470px" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
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
                onClick={() => {
                  setSelectedColor(color.value);
                  setIsEraserMode(false);
                }}
                className={`w-9 h-9 rounded-lg border-2 transition-all duration-150 hover:scale-110 ${
                  !isEraserMode && selectedColor === color.value
                    ? "border-foreground ring-2 ring-accent/50 scale-110"
                    : "border-border"
                }`}
                aria-label={`Cor ${color.title}`}
                style={{ backgroundColor: color.value }}
              />
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
                onClick={() => setSelectedBrushSize(brush.size)}
                className={`flex items-center justify-center w-9 h-9 rounded-lg border-2 transition-all text-xs font-bold ${
                  selectedBrushSize === brush.size
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
            onClick={() => setIsEraserMode((value) => !value)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 text-xs font-semibold transition-all ${
              isEraserMode
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
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
              />
            </svg>
            Borracha
          </button>
          <button
            onClick={handleClear}
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
              />
            </svg>
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
