import { useEffect, useRef } from "react";

const safeDocument = typeof document !== "undefined" ? document : {};

/**
 * Usage:
 * const [blockScroll, allowScroll] = useScrollBlock();
 */
export default function useScrollBlock(): [() => void, () => void] {
  const scrollBlocked = useRef<boolean>(false);
  const { body } = safeDocument as Document;
  const html = (safeDocument as Document).documentElement;

  const blockScroll = () => {
    if (!body || !body.style || scrollBlocked.current) return;

    const scrollBarWidth = window.innerWidth - (html?.clientWidth || 0);
    const bodyPaddingRight =
      parseInt(
        window.getComputedStyle(body).getPropertyValue("padding-right"),
      ) || 0;

    /**
     * 1. Fixes a bug in iOS and desktop Safari whereby setting
     *    `overflow: hidden` on the html/body does not prevent scrolling.
     * 2. Fixes a bug in desktop Safari where `overflowY` does not prevent
     *    scroll if an `overflow-x` style is also applied to the body.
     */
    if (html) {
      html.style.position = "relative"; /* [1] */
      html.style.overflow = "hidden"; /* [2] */
    }

    body.style.position = "relative"; /* [1] */
    body.style.overflow = "hidden"; /* [2] */
    body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`;

    scrollBlocked.current = true;
  };

  const allowScroll = () => {
    if (!body || !body.style || !scrollBlocked.current) return;

    if (html) {
      html.style.position = "";
      html.style.overflow = "";
    }

    body.style.position = "";
    body.style.overflow = "";
    body.style.paddingRight = "";

    scrollBlocked.current = false;
  };

  useEffect(() => {
    return () => {
      if (scrollBlocked.current) {
        allowScroll();
      }
    };
  }, []);

  return [blockScroll, allowScroll];
}
