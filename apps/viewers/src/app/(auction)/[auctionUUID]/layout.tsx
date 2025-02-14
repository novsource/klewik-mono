import { ReactNode } from "react";
import { AppContextProvider } from "~/app/_shared/context";
import { SearchProvider } from "~/app/_shared/context/search-bar-context/search-bar-context";

export default function AuctionLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AppContextProvider>
      <SearchProvider>{children}</SearchProvider>
    </AppContextProvider>
  );
}
