import Link from "next/link";
import Header from "../_shared/ui/header/ui/header.ui";

import { Typography } from "../_shared/ui/typography";

export default function ExplainsPage() {
  return (
    <div className="flex flex-col h-full w-full font-[family-name:var(--font-golos-text)]">
      <Header />
      <main className="h-full w-full">
        <div className="container w-full h-full mx-auto">
          <div className="flex flex-col w-full h-full mt-4">
            <Typography tag="h1">Гайд по работе с аукционом</Typography>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center pb-4">
        <Link
          className="text-md text-white/80 hover:text-white hover:underline hover:underline-offset-4 transition-all"
          href={"#"}
        >
          Пользовательское соглашение
        </Link>
      </footer>
    </div>
  );
}
