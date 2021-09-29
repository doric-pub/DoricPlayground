import {
  Panel,
  Group,
  vlayout,
  text,
  Color,
  navbar,
  navigator,
  LayoutSpec,
  hlayout,
  image,
  View,
  stack,
  Gravity,
  animate,
  Image,
  Text,
  ScaleType,
  jsx,
  VLayout,
  layoutConfig,
  Stack,
  HLayout,
  createRef,
} from "doric";
import {
  BarcodeFormat,
  barcodeScanner,
  ScanResult,
} from "doric-barcodescanner";
import icon_doric from "./assets/doric.png";
import { DebugPanel } from "./Debug";
import { Examples } from "./Examples";
import { FileManagerPanel } from "./FileManager";

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
    title: "开始调试",
    onClick: () => {
      navigator(context).push(DebugPanel, { alias: "__dev__" });
    },
  },
  {
    title: "查看示例",
    onClick: () => {
      navigator(context).push(Examples);
    },
  },
  {
    title: "扫码跳转",
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
    onClick: async () => {
      await navigator(context).push(FileManagerPanel);
    },
  },
];

@Entry
class DoricPlayground extends Panel {
  onShow() {
    navbar(context).setTitle("Doric Playground");
  }
  build(rootView: Group) {
    const logo = createRef<Image>();
    const intro = createRef<Text>();
    const entries = createRef<VLayout>();

    <VLayout
      parent={rootView}
      layoutConfig={layoutConfig().mostWidth().fitHeight()}
    >
      <Stack
        layoutConfig={layoutConfig().just().configAlignment(Gravity.CenterX)}
        width={200}
        height={200}
      >
        <Image
          ref={logo}
          imageBase64={icon_doric}
          layoutConfig={layoutConfig().just().configAlignment(Gravity.Center)}
          scaleType={ScaleType.ScaleAspectFit}
        />
      </Stack>
      <Text
        ref={intro}
        layoutConfig={layoutConfig()
          .mostWidth()
          .fitHeight()
          .configAlignment(Gravity.Center)}
        padding={{ left: 15, right: 15 }}
        textSize={20}
        fontStyle="italic"
        textColor={Color.GRAY}
        maxLines={0}
        alpha={0}
      >
        Doric - 应用快速开发框架
      </Text>
      <VLayout
        layoutConfig={layoutConfig()
          .mostWidth()
          .fitHeight()
          .configMargin({ top: 30, left: 10, right: 10 })}
        space={10}
        alpha={1}
        ref={entries}
      >
        {...new Array(Math.round(entryData.length / 2))
          .fill(0)
          .map((_, index) => (
            <HLayout
              layoutConfig={layoutConfig().mostWidth().justHeight()}
              height={50}
              space={10}
            >
              <Text
                textSize={20}
                textColor={Color.WHITE}
                backgroundColor={colors[0]}
                layoutConfig={layoutConfig()
                  .justWidth()
                  .mostHeight()
                  .configWeight(1)}
              >
                {entryData[index * 2].title}
              </Text>
              <Text
                textSize={20}
                textColor={Color.WHITE}
                backgroundColor={colors[0]}
                layoutConfig={layoutConfig()
                  .justWidth()
                  .mostHeight()
                  .configWeight(1)}
                alpha={!!entryData[index * 2 + 1] ? 1 : 0}
              >
                {entryData[index * 2 + 1]?.title || ""}
              </Text>
            </HLayout>
          ))}
      </VLayout>
    </VLayout>;

    this.addOnRenderFinishedCallback(async () => {
      await animate(context)({
        animations: () => {
          logo.current.width = logo.current.height = 200;
          intro.current.alpha = 1;
        },
        duration: 2000,
      });
      entries.current.alpha = 1;
    });
  }
}
