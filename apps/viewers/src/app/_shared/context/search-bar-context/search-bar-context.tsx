"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";

type SearchBarContextState = {
  inputRef: RefObject<HTMLInputElement | null>;
  searchText: string | null;
  setSearchText: Dispatch<SetStateAction<string>>;
};

const SearchBarContext = createContext<SearchBarContextState | null>(null);

const useSearchContext = () => {
  const context = useContext(SearchBarContext);

  if (!context) {
    throw new Error("You should use context hook inside provider");
  }

  return context;
};

const SearchProvider = ({ children }: { children: ReactNode }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState<string>("");

  return (
    <SearchBarContext value={{ inputRef, searchText, setSearchText }}>
      {children}
    </SearchBarContext>
  );
};

export { useSearchContext, SearchProvider };
