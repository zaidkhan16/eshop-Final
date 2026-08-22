import React, { useEffect, useState } from "react";

const ThreeDCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPosition, setTrailingPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    // Check if device supports fine pointer (desktop mouse)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable / interactive elements
      const target = e.target;
      const isClickable =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.closest('[role="button"]') ||
        target.closest(".cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovered(!!isClickable);
    };

    const handleMouseDown = (e) => {
      setIsClicked(true);
      const newClick = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setClicks((prev) => [...prev.slice(-4), newClick]);
      setTimeout(() => setIsClicked(false), 200);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth lerp movement loop for 3D trailing ring
  useEffect(() => {
    let animationFrameId;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const followMouse = () => {
      setTrailingPosition((prev) => ({
        x: lerp(prev.x, position.x, 0.18),
        y: lerp(prev.y, position.y, 0.18),
      }));
      animationFrameId = requestAnimationFrame(followMouse);
    };

    animationFrameId = requestAnimationFrame(followMouse);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

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
        style={{
          transform: `translate3d(${trailingPosition.x - (isHovered ? 24 : 16)}px, ${
            trailingPosition.y - (isHovered ? 24 : 16)
          }px, 0) scale(${isClicked ? 0.8 : isHovered ? 1.4 : 1})`,
        }}
        className={`absolute rounded-full transition-transform duration-100 ease-out pointer-events-none ${
          isHovered
            ? "w-12 h-12 bg-gradient-to-tr from-indigo-600/30 via-purple-600/30 to-pink-500/30 border-2 border-indigo-400 backdrop-blur-xs shadow-[0_10px_30px_rgba(99,102,241,0.6)]"
            : "w-8 h-8 bg-indigo-500/10 border border-indigo-500/40 shadow-[0_4px_15px_rgba(99,102,241,0.3)]"
        }`}
      >
        {/* Subtle 3D Sphere Highlight Reflection */}
        <span className="absolute top-1 left-1 w-2.5 h-2.5 bg-white/60 rounded-full blur-[0.5px]" />
      </div>

      {/* Inner Precision Glowing Dot */}
      <div
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0) scale(${
            isClicked ? 1.5 : isHovered ? 1.2 : 1
          })`,
        }}
        className="absolute w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)] pointer-events-none transition-transform duration-75"
      />
    </div>
  );
};

export default ThreeDCursor;
