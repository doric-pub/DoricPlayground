import { BridgeContext, loge, storage } from "doric";

export interface Shortcut {
  filePath: string;
  title: string;
  icon?: string;
}

export async function getShortcuts(context: BridgeContext) {
  const shortcuts = await storage(context).getItem(
    "shortcuts",
    "DoricPlayground"
  );
  if (shortcuts && shortcuts.length > 0) {
    return JSON.parse(shortcuts) as Shortcut[];
  } else {
    return [];
  }
}

export async function addShortcut(context: BridgeContext, shortcut: Shortcut) {
  loge("addShortcut", shortcut);
  const shortcuts = await getShortcuts(context);
  if (!!!shortcuts.find((e) => e.filePath === shortcut.filePath)) {
    shortcuts.push(shortcut);
    await storage(context).setItem(
      "shortcuts",
      JSON.stringify(shortcuts),
      "DoricPlayground"
    );
    loge("addedShortcut", shortcut);
  }
}

export async function removeShortcut(
  context: BridgeContext,
  shortcut: Shortcut
) {
  const shortcuts = await getShortcuts(context);
  if (!!shortcuts.find((e) => e.filePath === shortcut.filePath)) {
    await storage(context).setItem(
      "shortcuts",
      JSON.stringify(shortcuts.filter((e) => e.filePath !== shortcut.filePath)),
      "DoricPlayground"
    );
    loge("removed", shortcut);
  }
}
