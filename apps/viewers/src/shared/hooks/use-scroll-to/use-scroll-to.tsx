import { RefObject, useCallback } from "react";

type UseScrollToOptions = ScrollToOptions;

const useScrollTo = (
  target: RefObject<HTMLElement | null>,
  options?: UseScrollToOptions,
) => {
  const scrollTo = useCallback(
    (scrollToOptions?: ScrollToOptions) => {
      const element = target.current;

      if (!element) return;

      element.scrollTo(scrollToOptions ?? options);
    },
    [target, options],
  );

  return scrollTo;
};

export { useScrollTo };
