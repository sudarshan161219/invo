import { useEffect, useRef, useState } from "react";

export function useInvoiceZoomAndDrag() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [autoScale, setAutoScale] = useState(1);
  const [manualZoom, setManualZoom] = useState(() => {
    const saved = localStorage.getItem("invoice_manual_zoom");
    return saved ? parseFloat(saved) : 1;
  });

  const MAX_SCALE = 0.76;
  const A4_W = 794;
  const A4_H = 1122;

  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

  const finalScale = Math.min(autoScale * manualZoom, MAX_SCALE);

  // Save zoom
  useEffect(() => {
    localStorage.setItem("invoice_manual_zoom", manualZoom.toString());
  }, [manualZoom]);

  // === DRAG LOGIC ===
  const startDrag = (x: number, y: number) => {
    dragRef.current = {
      startX: x,
      startY: y,
      origX: position.x,
      origY: position.y,
    };
  };

  const dragMove = (x: number, y: number) => {
    if (!dragRef.current) return;

    let newX = dragRef.current.origX + (x - dragRef.current.startX);
    let newY = dragRef.current.origY + (y - dragRef.current.startY);

    const container = containerRef.current;
    if (container) {
      const maxX = container.clientWidth / 2;
      const maxY = container.clientHeight / 2;

      newX = clamp(newX, -maxX, maxX);
      newY = clamp(newY, -maxY, maxY);
    }

    setPosition({ x: newX, y: newY });
  };

  const stopDrag = () => {
    dragRef.current = null;
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("touchmove", touchMove);
    window.removeEventListener("touchend", stopDrag);
  };

  const mouseMove = (e: MouseEvent) => dragMove(e.clientX, e.clientY);
  const touchMove = (e: TouchEvent) => {
    const t = e.touches[0];
    dragMove(t.clientX, t.clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startDrag(e.clientX, e.clientY);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", stopDrag);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", stopDrag);
  };

  // === AUTO SCALE ===
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      const scaleX = w / A4_W;
      const scaleY = h / A4_H;

      setAutoScale(Math.min(scaleX, scaleY, 1));
    };

    resize();

    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return {
    containerRef,
    position,
    finalScale,
    autoScale,
    manualZoom,
    setManualZoom,
    MAX_SCALE,
    handleMouseDown,
    handleTouchStart,
  };
}
