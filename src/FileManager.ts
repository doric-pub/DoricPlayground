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
} from "doric";
import { fs } from "doric-fs";
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
    const files = await fs(context).readDir(root);
    const ret: FileInfo[] = [];
    for (let file of files) {
      try {
        const isDir = await fs(context).isDirectory(file);
        ret.push({
          path: file,
          name: file.substr(file.lastIndexOf("/") + 1),
          dir: isDir,
        });
      } catch (error) {
        modal(context).alert(`${error}`);
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
        const documentPath = await fs(context).getDocumentsDir();
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
          onClick: async () => {
            if ("Import from local" === e.name) {
              const url = await fs(context).choose({
                uniformTypeIdentifiers: [
                  "public.source-code",
                  "public.executable",
                ],
                mimeType: "application/javascript",
              });
              const path = url.substr("file://".length);
              const content = await fs(context).readFile(path);
              const dstPath = state.root + path.substr(path.lastIndexOf("/"));
              await fs(context).writeFile(dstPath, content);
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
                navigator(context).push(e.path);
              } else {
                modal(context).alert(`Donot support open:${e.path}`);
              }
            }
          },
        })
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
