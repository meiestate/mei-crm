import { useEffect, useState } from "react";

function getWindowSize() {
  if (typeof window === "undefined") {
    return {
      width: 1440,
      height: 900,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function useResponsive() {
  const [screen, setScreen] = useState(getWindowSize);

  useEffect(() => {
    const onResize = () => {
      setScreen(getWindowSize());
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = screen.width < 768;
  const isTablet = screen.width >= 768 && screen.width < 1024;
  const isDesktop = screen.width >= 1024;
  const isSmallMobile = screen.width < 480;

  return {
    width: screen.width,
    height: screen.height,
    isSmallMobile,
    isMobile,
    isTablet,
    isDesktop,
  };
}