import { ClassValue } from "clsx";
import Image from "next/image";
import { Typography } from "~/app/_shared/ui/typography";
import { cn } from "~/app/_shared/utils";

export default function IntegrationPlatformChip({
  href,
  integrationName,
  className,
}: {
  href: string;
  integrationName: "Twitch" | "Youtube" | "Donation Alerts";
  className?: ClassValue;
}) {
  const integrationLogo = {
    Twitch: (
      <Image src="/twitchLogo.svg" alt="Twitch logo" width={14} height={14} />
    ),
    Youtube: (
      <Image src="/youtube.svg" alt="Youtube logo" width={18} height={14} />
    ),
    "Donation Alerts": (
      <Image
        src="/donationAlerts.svg"
        alt="Donation Alerts logo"
        width={14}
        height={14}
      />
    ),
  }[integrationName];

  return (
    <a
      className={cn(
        `flex w-fit gap-x-2 px-2 hover:text-white-accent hover:underline hover:underline-offset-2 transition-all`,
        className,
      )}
      href={href}
    >
      <div className="flex gap-x-1.5">
        {integrationLogo}
        <Typography className="font-semibold text-sm" tag="span">
          {integrationName}
        </Typography>
      </div>

      <Image src="/linkArrow.svg" alt="link arrow" width={12} height={12} />
    </a>
  );
}
