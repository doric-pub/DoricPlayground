import {
  Panel,
  Group,
  vlayout,
  layoutConfig,
  text,
  Color,
  navbar,
  navigator,
  scroller,
  LayoutSpec,
  hlayout,
  gravity,
  image,
  View,
  ScaleType,
  stack,
  log,
} from "doric";
import icon_gobang from "./assets/gobang.png";
import icon_snake from "./assets/snake.png";
import icon_duad from "./assets/duad.png";
import { HelloDoric } from "./HelloDoric";
import { Poetry } from "./Poetry";
import { Counter } from "./Counter";
import { ImageDemo } from "./Image";
import { StorageDemo } from "./Storage";
import { ModalDemo } from "./Modal";
import { PopoverDemo } from "./Popover";
import { Gobang } from "./Gobang";
import { SnakePanel } from "./Snake";
import { DuadPanel } from "./DuadGame";
const colors = [
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
const examples = [
  {
    name: "Hello,Doric",
    panel: HelloDoric,
    alias: "HelloDoric.js",
  },
  {
    name: "诗",
    panel: Poetry,
    alias: "Poetry.js",
  },
  {
    name: "计数器",
    panel: Counter,
    alias: "Counter.js",
  },
  {
    name: "图片",
    panel: ImageDemo,
    alias: "Image.js",
  },
  {
    name: "存储",
    panel: StorageDemo,
    alias: "Storage.js",
  },
  {
    name: "Modal",
    panel: ModalDemo,
    alias: "Modal.js",
  },
  {
    name: "Popover",
    panel: PopoverDemo,
    alias: "Popover.js",
  },
];
const files = [
  {
    name: "五子棋",
    panel: Gobang,
    alias: "Gobang.js",
    icon: icon_gobang,
  },
  {
    name: "贪吃蛇",
    panel: SnakePanel,
    alias: "Snake.js",
    icon: icon_snake,
  },
  {
    name: "消消乐",
    panel: DuadPanel,
    alias: "DuadGame.js",
    icon: icon_duad,
  },
];
@Entry
export class Examples extends Panel {
  onShow() {
    navbar(this.context).setTitle("Doric示例");
  }
  build(rootView: Group) {
    scroller(
      vlayout(
        [
          stack([], {
            layoutConfig: layoutConfig().just().configWidth(LayoutSpec.MOST),
            height: 1,
            backgroundColor: colors[3].alpha(0.2),
          }),
          hlayout(
            [
              text({
                text: "示例",
                textSize: 20,
                layoutConfig: layoutConfig()
                  .fit()
                  .configAlignment(gravity().centerY())
                  .configMargin({
                    left: 15,
                  }),
              }),
            ],
            {
              layoutConfig: layoutConfig()
                .just()
                .configWidth(LayoutSpec.MOST)
                .configMargin({
                  top: 0,
                }),
              height: 50,
              backgroundColor: colors[3].alpha(0.2),
            }
          ),
          ...examples.map((e) =>
            vlayout(
              [
                hlayout(
                  [
                    text({
                      text: e.name,
                      textSize: 30,
                      textColor: Color.BLACK,
                      layoutConfig: layoutConfig()
                        .fit()
                        .configAlignment(gravity().centerY())
                        .configMargin({
                          left: 15,
                        }),
                    }),
                  ],
                  {
                    layoutConfig: layoutConfig()
                      .just()
                      .configWidth(LayoutSpec.MOST)
                      .configMargin({
                        top: 10,
                        bottom: 10,
                      }),
                    height: 50,
                  }
                ),
                stack([], {
                  layoutConfig: layoutConfig()
                    .just()
                    .configWidth(LayoutSpec.MOST),
                  height: 1,
                  backgroundColor: colors[3].alpha(0.2),
                }),
              ],
              {
                layoutConfig: layoutConfig().fit().configWidth(LayoutSpec.MOST),
                onClick: () => {
                  navigator(this.context).push(e.panel, {
                    alias: e.alias,
                  });
                },
              }
            )
          ),
          hlayout(
            [
              text({
                text: "小游戏",
                textSize: 20,
                layoutConfig: layoutConfig()
                  .fit()
                  .configAlignment(gravity().centerY())
                  .configMargin({
                    left: 15,
                  }),
              }),
            ],
            {
              layoutConfig: layoutConfig()
                .just()
                .configWidth(LayoutSpec.MOST)
                .configMargin({
                  top: 0,
                }),
              height: 50,
              backgroundColor: colors[3].alpha(0.2),
            }
          ),
          ...files.map((e) =>
            vlayout(
              [
                hlayout(
                  [
                    image({
                      imageBase64: e.icon,
                      layoutConfig: layoutConfig().just(),
                      width: 50,
                      height: 50,
                      scaleType: ScaleType.ScaleAspectFit,
                    }),
                    text({
                      text: e.name,
                      textSize: 30,
                      textColor: Color.BLACK,
                      layoutConfig: layoutConfig()
                        .fit()
                        .configAlignment(gravity().centerY())
                        .configMargin({
                          left: 15,
                        }),
                    }),
                  ],
                  {
                    layoutConfig: layoutConfig()
                      .just()
                      .configWidth(LayoutSpec.MOST)
                      .configMargin({
                        top: 10,
                        bottom: 10,
                      }),
                    height: 50,
                  }
                ),
                stack([], {
                  layoutConfig: layoutConfig()
                    .just()
                    .configWidth(LayoutSpec.MOST),
                  height: 1,
                  backgroundColor: colors[3].alpha(0.2),
                }),
              ],
              {
                layoutConfig: layoutConfig().fit().configWidth(LayoutSpec.MOST),
                onClick: () => {
                  navigator(this.context).push(e.panel, {
                    alias: e.alias,
                  });
                },
              }
            )
          ),
        ],
        {
          layoutConfig: layoutConfig().fit().configWidth(LayoutSpec.MOST),
        }
      ),
      {
        layoutConfig: layoutConfig().most(),
      }
    ).in(rootView);
  }
}
