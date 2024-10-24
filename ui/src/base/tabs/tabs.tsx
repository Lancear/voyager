import { For, Show } from "solid-js";
import { cls } from "../styles";
import type { TabManager } from "./create-tab-manager";
import { Dynamic } from "solid-js/web";

export interface TabsProps {
  tabManager: TabManager;
}

export function Tabs({ tabManager }: TabsProps) {
  return (
    <Show when={tabManager.selectedTab()} fallback={tabManager.noTabRenderer?.()}>
      <div class="relative h-full w-full flex flex-col">
        <div class="py-2 px-3 flex gap-2 flex-wrap border-b border-zinc-300">
          <For each={tabManager.tabs()}>
            {(tab) => (
              <div 
                onClick={() => tabManager.selectTab(tab.id)}
                title={tab.id}
                class={cls(
                  "pl-1.5 pr-1 py-0.5 flex items-center gap-1 text-zinc-700 text-md rounded",
                  "bg-zinc-200 bg-opacity-60 hover:bg-indigo-500 hover:bg-opacity-10",
                  "transition-all cursor-pointer",
                  tabManager.selectedTab()?.id === tab.id && "border-l-4 border-indigo-400"
                )}
              >
                <Show when={tab.iconPath}>
                  <svg
                    class="size-3.5 shrink-0 text-zinc-500"
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke-width={1.5} 
                    stroke="currentColor"
                  >
                    {tab.iconPath?.()}
                  </svg>
                </Show>
                <span>{tab.name}</span>
                <Show when={!tab.preventClose}>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      tabManager.closeTab(tab.id);
                    }}
                    class="p-1 shrink-0 text-zinc-500 rounded-full hover:bg-zinc-300 hover:text-zinc-700 transition-all cursor-pointer"
                  >
                    <svg
                      class="size-3"
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke-width={1.5} 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </div>
                </Show>
              </div>
            )}
          </For>
        </div>
        <div class="w-full h-1/2 flex-grow py-2 px-3">
          <Dynamic component={tabManager.selectedTab()?.renderer} />
        </div>
      </div>
    </Show>
  );
}
