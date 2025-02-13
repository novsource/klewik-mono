"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type ViewState = {
  ratio: number;
  inView: boolean;
};

type AppContextState = {
  state: Record<"title" | "integrations" | "searchBar", ViewState>;
  dispatchers?: Record<
    "title" | "integrations" | "searchBar",
    (data: ViewState) => void
  >;
};

const appContextInitValue: AppContextState = {
  state: {
    integrations: {
      inView: true,
      ratio: 1,
    },
    searchBar: {
      inView: true,
      ratio: 1,
    },
    title: {
      inView: true,
      ratio: 1,
    },
  },
};

const AppContext = createContext(appContextInitValue);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("You should use context inside provider");
  }

  return context;
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [viewState, setViewState] = useState(appContextInitValue);

  const setTitleView = useCallback((data: ViewState) => {
    setViewState((prev) => ({ state: { ...prev.state, title: data } }));
  }, []);

  const setIntegrationView = useCallback((data: ViewState) => {
    setViewState((prev) => ({ state: { ...prev.state, integrations: data } }));
  }, []);

  const setSearchBarView = useCallback((data: ViewState) => {
    setViewState((prev) => ({ state: { ...prev.state, searchBar: data } }));
  }, []);

  return (
    <AppContext
      value={{
        state: { ...viewState.state },
        dispatchers: {
          integrations: setIntegrationView,
          title: setTitleView,
          searchBar: setSearchBarView,
        },
      }}
    >
      {children}
    </AppContext>
  );
};
