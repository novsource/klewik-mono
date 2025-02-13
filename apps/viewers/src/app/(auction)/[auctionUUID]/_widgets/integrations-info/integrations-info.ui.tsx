"use client";

import { useEffect, useRef } from "react";

import { Typography } from "~/app/_shared/ui/typography";
import { IntegrationPlatformChip } from "../../components/integration-chip";
import { useIntersection } from "~/app/_shared/hooks/use-intersection";
import { useAppContext } from "~/app/_shared/context/app-context";

const IntegrationsInfo = () => {
  const {
    state: { integrations },
    dispatchers,
  } = useAppContext();
  const integrationsCardWrapperRef = useRef<HTMLDivElement | null>(null);

  const intersection = useIntersection(integrationsCardWrapperRef, {
    threshold: 0,
  });

  useEffect(() => {
    if (integrations.ratio !== intersection.intersectRatio)
      dispatchers?.integrations({
        inView: true,
        ratio: intersection.intersectRatio,
      });
  }, [
    intersection.inFullView,
    intersection.intersectRatio,
    dispatchers,
    integrations.ratio,
  ]);

  return (
    <div
      ref={integrationsCardWrapperRef}
      className="flex flex-col gap-y-2.5 tablet:gap-y-4"
    >
      <div className="flex flex-col gap-y-1.5 items-start">
        <Typography className="text-sm font-semibold text-gray-accent" tag="p">
          Транслируется на стриминговые платформы
        </Typography>
        <div className="flex divide-x-1 divide-gray/50 -ml-1">
          <IntegrationPlatformChip
            href="https://www.twitch.tv/nyamuras"
            integrationName="Twitch"
          />
          <IntegrationPlatformChip
            href="https://www.youtube.com"
            integrationName="Youtube"
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-1.5 items-start">
        <Typography className="text-sm font-semibold text-gray-accent" tag="p">
          Подключенные интеграции
        </Typography>
        <div className="flex divide-x-1 divide-gray/50 -ml-1">
          <IntegrationPlatformChip
            href="https://www.donationalerts.com/r/bratishkinoff"
            integrationName="Donation Alerts"
          />
        </div>
      </div>
    </div>
  );
};

export { IntegrationsInfo };
