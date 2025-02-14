"use client";

import { useEffect, useRef, useState } from "react";
import { Typography } from "~/app/_shared/ui/typography";

type TimerProps = {
  startTime: number;
  value: number;
  onEnd?: () => void;
};

const calcTimeDifference = (initTime: number, value: number) => {
  const diff = Math.floor(Math.abs(initTime - Date.now()) / 1000);

  if (diff >= value) {
    return 0;
  } else return value - diff;
};

const RefreshPageTimer = ({ value, startTime, onEnd }: TimerProps) => {
  const [time, setTime] = useState(() => calcTimeDifference(startTime, value));

  const initTime = useRef(startTime);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(calcTimeDifference(initTime.current, value));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [time, onEnd, value]);

  return <Typography tag="span">{time}</Typography>;
};

export { RefreshPageTimer };
