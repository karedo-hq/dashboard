import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import defaultTheme from 'tailwindcss/defaultTheme';

const screens = defaultTheme.screens;

const isSSR =
  typeof window === 'undefined' ||
  !window.navigator ||
  /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);

const isBrowser = !isSSR;

const useIsomorphicEffect = isBrowser ? useLayoutEffect : useEffect;

/**
 * Hook to check if the current viewport matches the provided breakpoint
 * @param breakpoint - The breakpoint to check against
 * @param defaultValue - The default value to return if the matchMedia API is not available
 * @returns A boolean indicating if the viewport matches the provided breakpoint
 */
export function useBreakpoint(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl',
  defaultValue: boolean = false,
): boolean {
  const [match, setMatch] = useState(() => defaultValue);
  const matchRef = useRef(defaultValue);

  useIsomorphicEffect(() => {
    if (!(isBrowser && 'matchMedia' in window)) return undefined;

    const track = () => {
      const value = (screens[breakpoint] as string) ?? '999999px';
      const query = window.matchMedia(`(min-width: ${value})`);
      matchRef.current = query.matches;
      if (matchRef.current != match) {
        setMatch(matchRef.current);
      }
    };

    window.addEventListener('resize', track);
    return () => window.removeEventListener('resize', track);
  });

  useIsomorphicEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  return match;
}
