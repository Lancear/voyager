import { createEffect, createSignal, type Accessor, type JSXElement } from "solid-js";

export interface Tab {
  id: string;
  name: string;
  renderer(): JSXElement;
  iconPath?(): JSXElement;
  preventClose?: boolean;
  onSelect?(): void;
  onHide?(): void;
}

export interface TabManager {
  tabs: Accessor<Tab[]>;
  selectedTab: Accessor<Tab | undefined>;
  openTab(tab: Tab): void;
  selectTab(tabId: string | undefined): void;
  closeTab(tabId: string): void;
  noTabRenderer?(): JSXElement;
}

export function createTabManager(options?: Pick<TabManager, "noTabRenderer">): TabManager {
  const [tabs, setTabs] = createSignal<Tab[]>([]);
  const [selectedTab, selectTab] = createSignal<Tab | undefined>(undefined);

  createEffect(() => {
    const tab = tabs()?.[0];

    if (!selectedTab() && tab) {
      switchTab(tab.id);
    }
  });

  function switchTab(tabId: string | undefined) {
    console.log({ tabId, selectedTabId: selectedTab()?.id });

    if (tabId === selectedTab()?.id) return;

    const tab = tabId ? tabs().find(t => tabId === t.id) : undefined;
    console.log("tab found");

    if (tabId && !tab) return;

    console.log("hide old tab");
    selectedTab()?.onHide?.();

    console.log("select new tab");
    selectTab(tab);
    tab?.onSelect?.();
  }

  return {
    tabs,
    selectedTab,
    openTab(tab: Tab) {
      const tabAlreadyOpen = tabs().some(t => tab?.id === t.id);

      if (!tabAlreadyOpen) {
        setTabs(tabs().concat([tab]));
      }

      switchTab(tab.id);
    },
    selectTab(tabId: string | undefined) {
      switchTab(tabId);
    },
    closeTab(tabId: string) {
      const tab = tabs().find(t => tabId === t.id);
      if (!tab || tab.preventClose) return;

      setTabs(tabs().filter(t => t.id !== tab.id));
      switchTab(undefined);
    },
    noTabRenderer: options?.noTabRenderer,
  }
}
