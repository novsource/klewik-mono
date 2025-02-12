import { notFound } from "next/navigation";

import Header from "../../_shared/ui/header/ui/header.ui";
import { Typography } from "../../_shared/ui/typography";

import { IntegrationPlatformChip } from "./components/integration-chip";
import { Post } from "./components/slots-list/slots-list.ui";
import { ControlledSlotsMemo } from "./_widgets/controlled-slots/controlled-slots.ui";
import { RefreshPageTimer } from "./components/refresh--page-timer";
import { IntegrationsInfo } from "./_widgets/integrations-info";

export const revalidate = 120;
export const dynamicParams = true;

async function getPosts() {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
    cache: "force-cache",
  });

  const posts = (await response.json()) as Post[];

  return posts;
}

async function getAuctionInfo(id: string) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      cache: "force-cache",
    },
  );

  const post: Post = await response.json();

  if (!post) notFound();
  return post;
}

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auctionId = await getAuctionInfo(id);

  return {
    title: `Аукцион номер #${auctionId}`,
  };
}

export default async function AuctionPage() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col h-full w-full font-[family-name:var(--font-golos-text)]">
      <Header className="shrink-0 tablet:px-0" />
      <main className="main_auction pb-4">
        <div className="container w-full h-full mx-auto">
          <div className="flex flex-col w-full h-full gap-y-6 tablet:gap-y-8 overflow-y-scroll">
            <div className="flex flex-col gap-y-2.5 tablet:gap-y-4">
              <div className="flex flex-col gap-y-1">
                <Typography tag="h1">Аукцион №1000</Typography>
                <Typography
                  className="text-xs tablet:text-sm text-gray"
                  tag="span"
                >
                  Cоздан: {new Intl.DateTimeFormat().format(Date.now())}
                </Typography>
              </div>
              <div className="flex flex-col gap-y-2">
                <IntegrationsInfo />
                <Typography className="text-sm text-gray-accent" tag="span">
                  Сайт обновится через:{" "}
                  {<RefreshPageTimer startTime={Date.now()} value={120} />}{" "}
                  секунд
                </Typography>
              </div>
            </div>
            <ControlledSlotsMemo slots={posts} />
          </div>
        </div>
      </main>
    </div>
  );
}
