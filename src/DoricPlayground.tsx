import {
  Panel,
  Group,
  Color,
  navigator,
  Gravity,
  animate,
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
  FlexLayout,
  Wrap,
  FlexTypedValue,
  FlexDirection,
  Justify,
  GestureContainer,
  modal,
  Scroller,
  HLayout,
  AssetsResource,
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

interface HomeModel {
  shortcuts: Shortcut[];
}

class HomeVH extends ViewHolder {
  shortcutArea = createRef<FlexLayout>();
  build(root: Group) {
    const logo = createRef<Image>();
    const intro = createRef<HLayout>();
    <Scroller parent={root} layoutConfig={layoutConfig().most()}>
      <VLayout layoutConfig={layoutConfig().mostWidth().fitHeight()}>
        <Stack
          layoutConfig={layoutConfig().just().configAlignment(Gravity.CenterX)}
          width={200}
          height={200}
        >
          <Image
            ref={logo}
            image={new AssetsResource("doric.png")}
            layoutConfig={layoutConfig().just().configAlignment(Gravity.Center)}
            scaleType={ScaleType.ScaleAspectFit}
          />
        </Stack>
        <HLayout
          ref={intro}
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          gravity={Gravity.Bottom.centerX()}
          space={5}
          alpha={0}
        >
          <Text textSize={20} fontStyle="italic" textColor={Color.GRAY}>
            Doric - 应用快速开发框架
          </Text>
          <Text textSize={14} fontStyle="italic" textColor={Color.GRAY}>
            {`${packageJson.dependencies.doric.replace("^", "")}`}
          </Text>
        </HLayout>

        <FlexLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          flexConfig={{
            width: Environment.screenWidth,
            flexDirection: FlexDirection.ROW,
            flexWrap: Wrap.WRAP,
            justifyContent: Justify.SPACE_BETWEEN,
            padding: 10,
          }}
        >
          {entryData.map((e) => (
            <Text
              flexConfig={{
                width: FlexTypedValue.percent(48),
                height: 50,
                marginVertical: 5,
              }}
              textSize={20}
              textColor={Color.WHITE}
              backgroundColor={colors[0]}
              onClick={() => {
                e.onClick();
              }}
            >
              {e.title}
            </Text>
          ))}
        </FlexLayout>
        <Stack
          layoutConfig={layoutConfig().mostWidth().justHeight()}
          height={1}
          backgroundColor={Color.parse("#eeeeee")}
        />
        <FlexLayout
          ref={this.shortcutArea}
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          flexConfig={{
            width: Environment.screenWidth,
            flexDirection: FlexDirection.ROW,
            flexWrap: Wrap.WRAP,
            justifyContent: Justify.SPACE_BETWEEN,
            padding: 10,
          }}
        />
      </VLayout>
    </Scroller>;

    (context.entity as Panel).addOnRenderFinishedCallback(async () => {
      await animate(context)({
        animations: () => {
          logo.current.width = logo.current.height = 200;
          intro.current.alpha = 1;
        },
        duration: 2000,
      });
    });
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
    // for (let i = 0; i < 100; i++) {
    //   await addShortcut(this.context, { title: `${i}`, filePath: `${i}` });
    // }
    await this.refresh();
  }
  onAttached(state: HomeModel, vh: HomeVH) {
    this.initData();
  }
  onBind(state: HomeModel, vh: HomeVH) {
    vh.shortcutArea.current.also((it) => {
      it.removeAllChildren();
      state.shortcuts
        .map((e) => (
          <GestureContainer
            flexConfig={{
              width: FlexTypedValue.percent(48),
              height: 50,
              marginVertical: 5,
            }}
            backgroundColor={colors[0]}
            onClick={() => {
              navigator(this.context).push(e.filePath);
            }}
            onLongPress={() => {
              modal(this.context)
                .confirm({
                  title: "",
                  msg: "删除该快捷方式么?",
                })
                .then(async () => {
                  await removeShortcut(this.context, e);
                  await this.refresh();
                });
            }}
          >
            <Text
              layoutConfig={layoutConfig().most()}
              textSize={20}
              textColor={Color.WHITE}
            >
              {e.title}
            </Text>
          </GestureContainer>
        ))
        .forEach((e) => it.addChild(e));
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
