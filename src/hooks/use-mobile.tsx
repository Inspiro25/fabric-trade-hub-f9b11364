
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Handle Safari and older browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // @ts-ignore - For older browsers
      mql.addListener(onChange);
    }
    
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        // @ts-ignore - For older browsers
        mql.removeListener(onChange);
      }
    };
  }, []);

  return !!isMobile;
}

export function useBreakpoint(breakpoint: number = MOBILE_BREAKPOINT) {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsBelow(window.innerWidth < breakpoint);
    };
    
    // Handle Safari and older browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // @ts-ignore - For older browsers
      mql.addListener(onChange);
    }
    
    setIsBelow(window.innerWidth < breakpoint);
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        // @ts-ignore - For older browsers
        mql.removeListener(onChange);
      }
    };
  }, [breakpoint]);

  return !!isBelow;
}
