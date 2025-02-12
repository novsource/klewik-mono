import { Typography } from "~/app/_shared/ui/typography";
import { IntegrationPlatformChip } from "../../components/integration-chip";

export default function IntegrationsInfo() {
  return (
    <div className="flex flex-col gap-y-2.5 tablet:gap-y-4">
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
}
