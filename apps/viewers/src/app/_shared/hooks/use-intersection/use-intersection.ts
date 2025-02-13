"use client";

import { RefObject, useCallback, useEffect, useState } from "react";

type IntersectionReturn = {
  intersectRatio: number;
  inFullView: boolean;
};

const useIntersection = (
  targetRef: RefObject<HTMLElement | null>,
  options?: IntersectionObserverInit,
) => {
  const [intersection, setIntersection] = useState<IntersectionReturn>({
    inFullView: false,
    intersectRatio: 0,
  });

  const intersectionCallback = useCallback<IntersectionObserverCallback>(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target === targetRef.current) {
          setIntersection(() => ({
            inFullView: entry.intersectionRatio === 1,
            intersectRatio: entry.intersectionRatio,
          }));
        }
      });
    },
    [targetRef],
  );

  useEffect(() => {
    const target = targetRef.current;

    if (target === null)
      return setIntersection({ intersectRatio: 0, inFullView: false });
    const observer = new IntersectionObserver(intersectionCallback, options);

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, intersectionCallback, options]);

  return intersection;
};

export { useIntersection };
