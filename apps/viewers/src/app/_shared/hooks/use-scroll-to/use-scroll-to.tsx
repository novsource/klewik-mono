import { RefObject, useCallback, useLayoutEffect, useRef } from "react";

type UseScrollToOptions = ScrollIntoViewOptions & {
  scrollOnInit: boolean;
};

const useScrollTo = (
  target: RefObject<HTMLElement | null>,
  options: UseScrollToOptions,
) => {
  const { scrollOnInit, ...scrollIntoViewOptions } = options;

  const isScrolledOnInit = useRef(false);

  const scrollTo = useCallback(
    (options?: ScrollIntoViewOptions) => {
      const element = target.current;

      if (!element) return;

      element.scrollIntoView(options);
    },
    [target],
  );

  useLayoutEffect(() => {
    if (!isScrolledOnInit.current && scrollOnInit) {
      isScrolledOnInit.current = true;
      scrollTo(scrollIntoViewOptions);
    }
  }, [scrollTo, scrollOnInit, scrollIntoViewOptions]);

  return scrollTo;
};

export { useScrollTo };
