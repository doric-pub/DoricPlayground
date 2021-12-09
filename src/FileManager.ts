import {
  Group,
  scroller,
  Scroller,
  ViewHolder,
  ViewModel,
  vlayout,
  VMPanel,
  layoutConfig,
  VLayout,
  LayoutSpec,
  text,
  Gravity,
  Color,
  modal,
  navigator,
  gestureContainer,
  notification,
} from "doric";
import { fs } from "doric-fs";
import { addShortcut } from "./ShortcutManager";
type FileInfo = {
  path: string;
  name: string;
  dir: boolean;
};

interface Model {
  root?: string;
  files: FileInfo[];
}
class FMVH extends ViewHolder {
  scroller!: Scroller;
  container!: VLayout;
  build(root: Group) {
    this.scroller = scroller(
      (this.container = vlayout([], {
        layoutConfig: {
          widthSpec: LayoutSpec.MOST,
          heightSpec: LayoutSpec.FIT,
        },
      })),
      {
        layoutConfig: layoutConfig().most(),
      }
    ).in(root);
  }
}

class FMVM extends ViewModel<Model, FMVH> {
  async loadFile(root: string) {
    const files = await fs(this.context).readDir(root);
    const ret: FileInfo[] = [];
    for (let file of files) {
      try {
        const isDir = await fs(this.context).isDirectory(file);
        ret.push({
          path: file,
          name: file.substr(file.lastIndexOf("/") + 1),
          dir: isDir,
        });
      } catch (error) {
        modal(this.context).alert(`${error}`);
      }
    }
    this.updateState((state) => {
      state.files = ret;
      state.root = root;
    });
  }

  onAttached(state: Model, vh: FMVH) {
    (async () => {
      let root;
      if (state.root) {
        root = state.root;
      } else {
        const documentPath = await fs(this.context).getDocumentsDir();
        root = documentPath;
      }
      await this.loadFile(root);
    })().then();
  }
  onBind(state: Model, vh: FMVH) {
    vh.container.removeAllChildren();
    [
      {
        name: "..",
        dir: true,
        path: state.root?.substring(0, state.root.lastIndexOf("/")),
      },
      ...state.files,
      {
        name: "Import from local",
        dir: true,
        path: "",
      },
    ].forEach((e) => {
      vh.container.addChild(
        gestureContainer(
          [
            text({
              text: e.name,
              textSize: 20,
              layoutConfig: {
                widthSpec: LayoutSpec.MOST,
                heightSpec: LayoutSpec.FIT,
              },
              maxLines: 0,
              textColor: e.dir ? Color.BLUE : Color.BLACK,
              textAlignment: Gravity.Left,
              padding: {
                left: 15,
                right: 15,
                top: 10,
                bottom: 10,
              },
            }),
          ],
          {
            onClick: async () => {
              if ("Import from local" === e.name) {
                const path = await fs(this.context).choose({
                  uniformTypeIdentifiers: [
                    "public.source-code",
                    "public.executable",
                  ],
                  mimeType: "application/javascript",
                });
                const content = await fs(this.context).readFile(path);
                const decodedPath = decodeURIComponent(path);
                const dstPath =
                  state.root + decodedPath.substr(decodedPath.lastIndexOf("/"));
                await fs(this.context).writeFile(dstPath, content);
                await this.loadFile(state.root || "");
                return;
              }
              if (!e.path) {
                return;
              }
              if (e.dir) {
                await this.loadFile(e.path);
              } else {
                if (e.path.indexOf(".js") >= 0) {
                  navigator(this.context).push(e.path);
                } else {
                  modal(this.context).alert(`Donot support open:${e.path}`);
                }
              }
            },
            onLongPress: async () => {
              if (!e.dir && e.path && e.path?.indexOf(".js") >= 0) {
                await modal(this.context).confirm({
                  title: "添加快捷方式到首页吗?",
                  msg: "",
                });
                const title = await modal(this.context).prompt({
                  title: "请输入快捷标题",
                  defaultText: e.path.replace(".js", ""),
                });
                await addShortcut(this.context, {
                  title: title,
                  filePath: e.path,
                });
                notification(this.context).publish({
                  biz: "Shortcut",
                  name: "Add",
                });
              }
            },
          }
        )
      );
    });
  }
}
@Entry
export class FileManagerPanel extends VMPanel<Model, FMVH> {
  getViewModelClass() {
    return FMVM;
  }
  getState() {
    return {
      root: (this.getInitData() as any)?.root,
      files: [],
    };
  }
  getViewHolderClass() {
    return FMVH;
  }
}
