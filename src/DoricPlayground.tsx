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
} from "doric";

import {
  BarcodeFormat,
  barcodeScanner,
  ScanResult,
} from "doric-barcodescanner";
import { DebugPanel } from "./Debug";
import { Examples } from "./Examples";
import { FileManagerPanel } from "./FileManager";
import { getShortcuts, removeShortcut, Shortcut } from "./ShortcutManager";
import packageJson from "../package.json";

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
    icon: new AssetsResource("icon_Dev.png"),
    onClick: () => {
      navigator(context).push(DebugPanel, { alias: "__dev__" });
    },
  },
  {
    title: "查看示例",
    icon: new AssetsResource("icon_Dev.png"),
    onClick: () => {
      navigator(context).push(Examples);
    },
  },
  {
    title: "扫码跳转",
    icon: new AssetsResource("icon_Dev.png"),
    onClick: async () => {
      const ret = await barcodeScanner(context).scan({
        restrictFormat: [BarcodeFormat.QR],
      });
      if (ret.result === ScanResult.SUCCESS) {
        await navigator(context).push(ret.formatNote);
      }
    },
  },
  {
    title: "本地文件",
    icon: new AssetsResource("icon_Dev.png"),
    onClick: async () => {
      await navigator(context).push(FileManagerPanel);
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
    vh.flowLayoutRef.apply({
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
        } else {
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
                gravity={Gravity.Center}
                space={20}
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
        }
      },
    });
  }
  onBind(state: HomeModel, vh: HomeVH) {
    vh.flowLayoutRef.apply({
      itemCount: entryData.length + 1,
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
