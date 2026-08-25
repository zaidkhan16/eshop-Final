import React, { useEffect, useState, useRef } from "react";

const ThreeDCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [clicks, setClicks] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);
  const animFrameId = useRef(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    // Disable custom cursor on touch screens
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const updateDOM = () => {
      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const isHovered = isHoveredRef.current;

      // Update precision inner dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0) scale(${
          isHovered ? 1.3 : 1
        })`;
      }

      // Smooth lerp for trailing 3D ring
      const tx = lerp(trailPos.current.x, mx, 0.32);
      const ty = lerp(trailPos.current.y, my, 0.32);
      trailPos.current = { x: tx, y: ty };

      const ringSize = isHovered ? 24 : 16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${tx - ringSize}px, ${ty - ringSize}px, 0) scale(${
          isHovered ? 1.35 : 1
        })`;

        if (isHovered) {
          ringRef.current.className =
            "absolute w-12 h-12 rounded-full border-2 border-indigo-400 bg-gradient-to-tr from-indigo-600/30 via-purple-600/30 to-pink-500/30 backdrop-blur-xs shadow-[0_10px_30px_rgba(99,102,241,0.6)] pointer-events-none transition-colors duration-150";
        } else {
          ringRef.current.className =
            "absolute w-8 h-8 rounded-full border border-indigo-500/40 bg-indigo-500/10 shadow-[0_4px_15px_rgba(99,102,241,0.3)] pointer-events-none transition-colors duration-150";
        }
      }

      const dx = Math.abs(mx - tx);
      const dy = Math.abs(my - ty);

      if (dx > 0.05 || dy > 0.05) {
        animFrameId.current = requestAnimationFrame(updateDOM);
      } else {
        isAnimating.current = false;
      }
    };

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!isVisible) {
        setIsVisible(true);
      }

      // Fast check for interactive target without forced layout re-calculation
      const target = e.target;
      if (target) {
        const isClickable = !!(
          target.closest("a") ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest('[role="button"]') ||
          target.closest(".cursor-pointer") ||
          target.closest("[onclick]") ||
          target.tagName === "A" ||
          target.tagName === "BUTTON"
        );
        isHoveredRef.current = isClickable;
      }

      if (!isAnimating.current) {
        isAnimating.current = true;
        animFrameId.current = requestAnimationFrame(updateDOM);
      }
    };

    const handleMouseDown = (e) => {
      setIsClicked(true);
      const newClick = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setClicks((prev) => [...prev.slice(-3), newClick]);
      setTimeout(() => setIsClicked(false), 200);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999999] overflow-hidden">
      {/* Click 3D Ripples */}
      {clicks.map((click) => (
        <span
          key={click.id}
          style={{
            left: `${click.x}px`,
            top: `${click.y}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-indigo-400 bg-indigo-500/20 animate-ping opacity-75 pointer-events-none"
        />
      ))}

      {/* Outer 3D Sphere Ring */}
      <div
        ref={ringRef}
        className="absolute rounded-full w-8 h-8 bg-indigo-500/10 border border-indigo-500/40 shadow-[0_4px_15px_rgba(99,102,241,0.3)] pointer-events-none"
      >
        <span className="absolute top-1 left-1 w-2.5 h-2.5 bg-white/60 rounded-full blur-[0.5px]" />
      </div>

      {/* Inner Precision Glowing Dot */}
      <div
        ref={dotRef}
        className="absolute w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)] pointer-events-none"
      />
    </div>
  );
};

export default ThreeDCursor;
