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
} from "doric";
import icon_doric from "./assets/doric.png";
import { colors } from "./utils";
const entryData = [
  {
    title: "开始调试",
    onClick: () => {
      context.callNative("qrcode", "debug");
    },
  },
  {
    title: "查看示例",
    onClick: () => {
      navigator(context).push("assets://src/Examples.js");
    },
  },
  {
    title: "扫码跳转",
    onClick: async () => {
      const url = (await context.callNative("qrcode", "scan")) as string;
      await navigator(context).push(url);
    },
  },
  {
    title: "本地文件",
    onClick: async () => {
      const url = (await context.callNative("file", "choose")) as string;
      await navigator(context).push(url);
    },
  },
  {
    title: "官网链接",
    onClick: async () => {
      await navigator(context).openUrl("https://doric.pub");
    },
  },
];

@Entry
class DoricPlayground extends Panel {
  onShow() {
    navbar(context).setTitle("Doric Playground");
  }
  build(rootView: Group) {
    let logo: Image;
    let intro: Text;
    let entries: View;
    vlayout(
      [
        stack(
          [
            (logo = image({
              imageBase64: icon_doric,
              layoutConfig: {
                widthSpec: LayoutSpec.JUST,
                heightSpec: LayoutSpec.JUST,
                alignment: Gravity.Center,
              },
              width: 0,
              height: 0,
            })),
          ],
          {
            layoutConfig: {
              widthSpec: LayoutSpec.JUST,
              heightSpec: LayoutSpec.JUST,
              alignment: Gravity.Center,
            },
            width: 200,
            height: 200,
          }
        ),
        (intro = text({
          layoutConfig: {
            widthSpec: LayoutSpec.MOST,
            heightSpec: LayoutSpec.FIT,
            alignment: Gravity.Center,
          },
          padding: {
            left: 15,
            right: 15,
          },
          text: `Doric是一个跨平台的应用开发框架.\n使用Typescript语言构建的应用可直接在Android、iOS或Web端无差别呈现.`,
          textSize: 20,
          fontStyle: "italic",
          textColor: Color.GRAY,
          maxLines: 0,
          alpha: 0,
        })),
        (entries = vlayout(
          [
            ...new Array(Math.round(entryData.length / 2))
              .fill(0)
              .map((_, index) => {
                return hlayout(
                  [
                    text({
                      text: entryData[index * 2].title,
                      textSize: 20,
                      textColor: Color.WHITE,
                      layoutConfig: {
                        widthSpec: LayoutSpec.JUST,
                        heightSpec: LayoutSpec.MOST,
                        weight: 1,
                      },
                      backgroundColor: colors[0],
                      onClick: () => {
                        entryData[index * 2]?.onClick();
                      },
                    }),
                    text({
                      text: entryData[index * 2 + 1]?.title || "",
                      textSize: 20,
                      textColor: Color.WHITE,
                      layoutConfig: {
                        widthSpec: LayoutSpec.JUST,
                        heightSpec: LayoutSpec.MOST,
                        weight: 1,
                      },
                      backgroundColor: colors[0],
                      onClick: () => {
                        entryData[index * 2 + 1]?.onClick();
                      },
                      alpha: !!entryData[index * 2 + 1] ? 1 : 0,
                    }),
                  ],
                  {
                    layoutConfig: {
                      widthSpec: LayoutSpec.MOST,
                      heightSpec: LayoutSpec.JUST,
                    },
                    height: 50,
                    space: 10,
                  }
                );
              }),
          ],
          {
            layoutConfig: {
              widthSpec: LayoutSpec.MOST,
              heightSpec: LayoutSpec.FIT,
              margin: { top: 30, left: 10, right: 10 },
            },
            space: 10,
            alpha: 0,
          }
        )),
      ],
      {
        layoutConfig: {
          widthSpec: LayoutSpec.MOST,
          heightSpec: LayoutSpec.MOST,
          margin: { top: 30 },
        },
      }
    ).in(rootView);

    this.addOnRenderFinishedCallback(async () => {
      await animate(context)({
        animations: () => {
          logo.width = logo.height = 200;
        },
        duration: 2000,
      });
      await animate(context)({
        animations: () => {
          intro.alpha = 1;
        },
        duration: 1000,
      });
      entries.alpha = 1;
    });
  }
}
