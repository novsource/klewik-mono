import { ReactNode } from "react";
import { AppContextProvider } from "~/app/_shared/context";

export default function AuctionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AppContextProvider>{children}</AppContextProvider>;
}
