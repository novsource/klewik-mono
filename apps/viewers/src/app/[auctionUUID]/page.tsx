import Link from "next/link";
import Header from "../_shared/ui/header/ui/header.ui";
import Image from "next/image";

export default function AuctionPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <main className="h-full w-full">
        <div className="container w-full h-full mx-auto"></div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center pb-4">
        <Link
          className="text-md text-white/80 hover:text-white hover:underline hover:underline-offset-4 transition-all"
          href={"#"}
        >
          Пользовательское соглашение
        </Link>
        <a
          className="flex gap-x-1.5 text-md text-white/80 hover:text-white hover:underline hover:underline-offset-4 transition-all"
          href={"http://localhost:5173"}
        >
          <Image
            src={"/linkArrow.svg"}
            width={14}
            height={14}
            alt="arrow svg icon"
          />
          Перейти на страницу с гайдом
        </a>
      </footer>
    </div>
  );
}
