import {
  Group,
  Color,
  navigator,
  Gravity,
  Image,
  Text,
  ScaleType,
  jsx,
  VLayout,
  layoutConfig,
  Stack,
  createRef,
  ViewHolder,
  ViewModel,
  VMPanel,
  HLayout,
  AssetsResource,
  FlowLayout,
  FlowLayoutItem,
  Base64Resource,
  GestureContainer,
  modal,
  notification,
  network,
  uniqueId,
  loge,
} from "doric";

import {
  BarcodeFormat,
  barcodeScanner,
  ScanResult,
} from "doric-barcodescanner";

import { DebugPanel } from "./Debug";

import { Examples } from "./Examples";

import { FileManagerPanel } from "./FileManager";

import {
  addShortcut,
  getShortcuts,
  removeShortcut,
  Shortcut,
} from "./ShortcutManager";

import packageJson from "../package.json";
import { MainWidget } from "doric-cookbook";
import { fs } from "doric-fs";
import { LittlestTokyo } from "./LittlestTokyo";
export const colors = [
  "#70a1ff",
  "#7bed9f",
  "#ff6b81",
  "#a4b0be",
  "#f0932b",
  "#eb4d4b",
  "#6ab04c",
  "#e056fd",
  "#686de0",
  "#30336b",
].map((e) => Color.parse(e));

const entryData = [
  {
    title: "开始开发",
    icon: new AssetsResource("icon_dev.png"),
    onClick: () => {
      navigator(context).push(DebugPanel, { alias: "__dev__" });
    },
  },
  {
    title: "开发手册",
    icon: new AssetsResource("icon_app.png"),
    onClick: async () => {
      await navigator(context).push(MainWidget);
    },
  },
  {
    title: "扫码跳转",
    icon: new AssetsResource("icon_scan.png"),
    onClick: async () => {
      const ret = await barcodeScanner(context).scan({
        restrictFormat: [BarcodeFormat.QR],
      });
      if (ret.result === ScanResult.SUCCESS) {
        if (
          ret.rawContent.startsWith("http") &&
          ret.rawContent.endsWith(".js")
        ) {
          try {
            const res = await network(context).get(ret.rawContent);
            const dir = await fs(context).getDocumentsDir();
            const name = uniqueId("Bundle");
            const path = `${dir}/${name}`;
            await fs(context).writeFile(path, res.data);
            try {
              await modal(context).confirm("添加快捷方式到首页吗?");
              const title = await modal(context).prompt({
                title: "请输入快捷标题",
              });
              await addShortcut(context, {
                title: title,
                filePath: path,
              });
            } catch (e) {}
            await navigator(context).push(path);
          } catch (e) {
            modal(context).alert(`下载失败: url=${ret.rawContent},error=${e}`);
          }
        } else {
          await navigator(context).push(ret.rawContent);
        }
      }
    },
  },
  {
    title: "本地文件",
    icon: new AssetsResource("icon_file.png"),
    onClick: async () => {
      await navigator(context).push(FileManagerPanel);
    },
  },
  {
    title: "查看示例",
    icon: new AssetsResource("icon_example.png"),
    onClick: () => {
      navigator(context).push(Examples);
    },
  },
  {
    title: "3D模型",
    icon: new AssetsResource("icon_app.png"),
    onClick: () => {
      navigator(context).push(LittlestTokyo);
    },
  },
];

interface HomeModel {
  shortcuts: Shortcut[];
}

class HomeVH extends ViewHolder {
  flowLayoutRef = createRef<FlowLayout>();
  build(root: Group) {
    <FlowLayout
      ref={this.flowLayoutRef}
      parent={root}
      itemCount={2}
      rowSpace={10}
      columnSpace={10}
      columnCount={2}
      layoutConfig={layoutConfig().most().configMargin({ left: 10, right: 10 })}
    />;
  }
}

class HomeVM extends ViewModel<HomeModel, HomeVH> {
  async refresh() {
    const shortcuts = await getShortcuts(this.context);
    this.updateState((state) => {
      state.shortcuts = shortcuts;
    });
  }
  async initData() {
    await this.refresh();
  }
  onAttached(state: HomeModel, vh: HomeVH) {
    this.initData();
    notification(this.context).subscribe({
      biz: "Shortcut",
      name: "Add",
      callback: () => {
        this.refresh();
      },
    });
    notification(this.context).subscribe({
      biz: "Shortcut",
      name: "Remove",
      callback: () => {
        this.refresh();
      },
    });
  }
  onBind(state: HomeModel, vh: HomeVH) {
    vh.flowLayoutRef.apply({
      itemCount: entryData.length + state.shortcuts.length + 1,
      renderItem: (idx) => {
        if (idx === 0) {
          return (
            <FlowLayoutItem
              layoutConfig={layoutConfig().mostWidth().fitHeight()}
              identifier="firstHeader"
              fullSpan={true}
            >
              <VLayout
                layoutConfig={layoutConfig().mostWidth().fitHeight()}
                padding={{ bottom: 20 }}
                gravity={Gravity.Center}
              >
                <Image
                  layoutConfig={layoutConfig().just()}
                  width={200}
                  height={200}
                  scaleType={ScaleType.ScaleAspectFit}
                  image={new AssetsResource("doric.png")}
                />
                <Stack layoutConfig={layoutConfig().mostWidth().fitHeight()}>
                  <Text
                    layoutConfig={layoutConfig()
                      .fit()
                      .configAlignment(Gravity.Center)}
                    textSize={20}
                    textColor={Color.GRAY}
                  >
                    Doric-应用快速开发框架
                  </Text>
                  <Text
                    layoutConfig={layoutConfig()
                      .fit()
                      .configAlignment(Gravity.Bottom.right())
                      .configMargin({ right: 30 })}
                    textSize={14}
                    fontStyle="italic"
                    textColor={Color.GRAY}
                  >
                    {`v${packageJson.dependencies.doric.replace("^", "")}`}
                  </Text>
                </Stack>
              </VLayout>
            </FlowLayoutItem>
          ) as FlowLayoutItem;
        } else if (idx - 1 < entryData.length) {
          const data = entryData[idx - 1];
          return (
            <FlowLayoutItem
              layoutConfig={layoutConfig().mostWidth().justHeight()}
              backgroundColor={colors[idx % colors.length]}
              height={100}
              onClick={data.onClick}
            >
              <HLayout
                layoutConfig={layoutConfig().most()}
                gravity={Gravity.CenterY}
                padding={{ left: 20 }}
                space={10}
              >
                <Image
                  layoutConfig={layoutConfig().just()}
                  width={50}
                  height={50}
                  image={data.icon}
                />
                <Text textSize={20} textColor={Color.WHITE}>
                  {data.title}
                </Text>
              </HLayout>
            </FlowLayoutItem>
          ) as FlowLayoutItem;
        } else {
          const shortcut = state.shortcuts[idx - 1 - entryData.length];
          return (
            <FlowLayoutItem
              layoutConfig={layoutConfig().mostWidth().justHeight()}
              backgroundColor={colors[idx % colors.length]}
              height={100}
            >
              <GestureContainer
                layoutConfig={layoutConfig().most()}
                onSingleTap={() => {
                  navigator(this.context).push(shortcut.filePath);
                }}
                onLongPress={() => {
                  modal(this.context)
                    .confirm("确定删除该快捷方式么?")
                    .then(async () => {
                      await removeShortcut(this.context, shortcut);
                      await this.refresh();
                    });
                }}
              >
                <HLayout
                  layoutConfig={layoutConfig().most()}
                  gravity={Gravity.CenterY}
                  padding={{ left: 20 }}
                  space={10}
                >
                  <Image
                    layoutConfig={layoutConfig().just()}
                    width={50}
                    height={50}
                    image={
                      shortcut.icon
                        ? new Base64Resource(shortcut.icon)
                        : new AssetsResource("icon_app.png")
                    }
                  />
                  <Text textSize={20} textColor={Color.WHITE}>
                    {shortcut.title}
                  </Text>
                </HLayout>
              </GestureContainer>
            </FlowLayoutItem>
          ) as FlowLayoutItem;
        }
      },
    });
  }
}

@Entry
class DoricPlayground extends VMPanel<HomeModel, HomeVH> {
  getViewModelClass() {
    return HomeVM;
  }
  getState() {
    return {
      shortcuts: [],
    };
  }
  getViewHolderClass() {
    return HomeVH;
  }
}
