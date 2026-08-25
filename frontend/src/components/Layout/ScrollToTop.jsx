import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scroll window to top instantly on page navigation
    window.scrollTo(0, 0);

    // Trigger visual top progress bar pulse on page transition
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999999] h-[3px] overflow-hidden pointer-events-none bg-indigo-100/30">
      <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse transition-all duration-200 w-full" />
    </div>
  );
};

export default ScrollToTop;
