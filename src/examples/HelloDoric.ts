import {
  image,
  text,
  Gravity,
  Color,
  vlayout,
  layoutConfig,
  Panel,
  Group,
} from "doric";

@Entry
export class HelloDoric extends Panel {
  build(root: Group) {
    vlayout(
      [
        image({
          imageUrl: "https://doric.pub/logo.png",
        }),
        text({
          text: "Hello,    Doric",
          textSize: 12,
          textColor: Color.RED,
        }),
        text({
          text: "Hello,Doric",
          textSize: 16,
          textColor: Color.BLUE,
        }),
        text({
          text: "Hello,Doric",
          textSize: 20,
          textColor: Color.GREEN,
        }),
      ],
      {
        layoutConfig: layoutConfig().fit().configAlignment(Gravity.Center),
        space: 20,
        gravity: Gravity.Center,
      }
    ).in(root);
  }
}
