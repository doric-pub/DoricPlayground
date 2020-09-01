import {
  Color,
  Gravity,
  Group,
  LayoutSpec,
  Panel,
  Text,
  draggable,
  gravity,
  layoutConfig,
  modal,
  stack,
  text,
  vlayout,
} from "doric";

@Entry
class DraggableDemo extends Panel {
  build(root: Group) {
    let textView: Text;
    let drag = draggable(
      (textView = text({
        layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
        width: 100,
        height: 30,
        textColor: Color.RED,
        onClick: () => {
          modal(context).toast("Clicked");
        },
      })),
      {
        onDrag: (x: number, y: number) => {
          textView.text = "x: " + x.toFixed(0) + " y: " + y.toFixed(0);
        },
        layoutConfig: layoutConfig().just(),
        width: 100,
        height: 100,
        backgroundColor: Color.WHITE,
      }
    );
    vlayout(
      [
        text({
          text: "Draggable Demo",
          layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
          textSize: 30,
          textColor: Color.WHITE,
          backgroundColor: Color.parse("#7bed9f"),
          textAlignment: gravity().center(),
          height: 50,
        }),
        stack([drag], {
          layoutConfig: layoutConfig().most(),
        }),
      ],
      {
        layoutConfig: layoutConfig().most(),
        backgroundColor: Color.BLACK,
      }
    ).in(root);
  }
}
