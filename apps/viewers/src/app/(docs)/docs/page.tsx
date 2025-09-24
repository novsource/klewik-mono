import { Metadata } from "next";
import {allDocs as allDocsMdx} from 'contentlayer/generated'
import { Typography } from "~ui/typography";
import { notFound } from "next/navigation";
import { MDXContent } from "~ui/mdx";
import DocsSidebar from "./_components/docs-sidebar/docs-sidebar";

export function generateMetadata(): Metadata {
  return {
    title: "Документация к поинтовому аукциону Klewik"
  };
}

const docsPaths = ['about']

export default function DocsPage() {
  const doc = allDocsMdx.find(doc => doc._raw.sourceFileName === 'about.mdx')

  if (!doc) return notFound()

  return (
    <div className="flex flex-col h-full w-full font-[family-name:var(--font-golos-text)]">
      <main className="main_auction">
        <div className="relative container w-full h-full mx-auto">
          <DocsSidebar paths={docsPaths} />
          <div className="flex flex-col w-full h-full gap-y-6 tablet:gap-y-8 pt-4">
            <div className="flex flex-col gap-y-2.5 tablet:gap-y-4">
              <Typography tag="h1">
                Документация
              </Typography>
            </div>
            <MDXContent code={doc.body.code} />
          </div>
        </div>
      </main>
    </div>
  );
}
