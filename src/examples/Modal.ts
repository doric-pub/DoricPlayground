import {
  Group,
  Panel,
  text,
  Color,
  LayoutSpec,
  vlayout,
  Gravity,
  scroller,
  layoutConfig,
  modal,
} from "doric";

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

function label(str: string) {
  return text({
    text: str,
    textSize: 16,
  });
}

@Entry
export class ModalDemo extends Panel {
  build(rootView: Group): void {
    scroller(
      vlayout(
        [
          text({
            text: "Modal",
            layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
            textSize: 30,
            textColor: Color.WHITE,
            backgroundColor: colors[1],
            textAlignment: Gravity.Center,
            height: 50,
          }),
          label("toast on bottom"),
          label("Click me").apply({
            width: 200,
            height: 50,
            backgroundColor: colors[0],
            textSize: 30,
            textColor: Color.WHITE,
            layoutConfig: layoutConfig().just(),
            onClick: () => {
              modal(this.context).toast("This is a toast.");
            },
          }),
          label("toast on top"),
          label("Click me").apply({
            width: 200,
            height: 50,
            backgroundColor: colors[0],
            textSize: 30,
            textColor: Color.WHITE,
            layoutConfig: layoutConfig().just(),
            onClick: () => {
              modal(this.context).toast("This is a toast.", Gravity.Top);
            },
          }),

          label("toast on center"),
          label("Click me").apply({
            width: 200,
            height: 50,
            backgroundColor: colors[0],
            textSize: 30,
            textColor: Color.WHITE,
            layoutConfig: layoutConfig().just(),
            onClick: () => {
              modal(this.context).toast("This is a toast.", Gravity.Center);
            },
          }),
          text({
            text: "Alert",
            layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
            textSize: 30,
            textColor: Color.WHITE,
            backgroundColor: colors[2],
            textAlignment: Gravity.Center,
            height: 50,
          }),
          label("Click me").apply({
            width: 200,
            height: 50,
            backgroundColor: colors[0],
            textSize: 30,
            textColor: Color.WHITE,
            layoutConfig: layoutConfig().just(),
            onClick: () => {
              modal(this.context)
                .alert({
                  msg: "This is alert.",
                  title: "Alert title",
                  okLabel: "OkLabel",
                })
                .then((e) => {
                  modal(this.context).toast("Clicked OK.");
                });
            },
          }),
          text({
            text: "Confirm",
            layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
            textSize: 30,
            textColor: Color.WHITE,
            backgroundColor: colors[3],
            textAlignment: Gravity.Center,
            height: 50,
          }),
          label("Click me").apply({
            width: 200,
            height: 50,
            backgroundColor: colors[0],
            textSize: 30,
            textColor: Color.WHITE,
            layoutConfig: layoutConfig().just(),
            onClick: () => {
              modal(this.context)
                .confirm({
                  msg: "This is Confirm.",
                  title: "Confirm title",
                  okLabel: "OkLabel",
                  cancelLabel: "CancelLabel",
                })
                .then(
                  () => {
                    modal(this.context).toast("Clicked OK.");
                  },
                  () => {
                    modal(this.context).toast("Clicked Cancel.");
                  }
                );
            },
          }),
          text({
            text: "Prompt",
            layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
            textSize: 30,
            textColor: Color.WHITE,
            backgroundColor: colors[4],
            textAlignment: Gravity.Center,
            height: 50,
          }),
          label("Click me").apply({
            width: 200,
            height: 50,
            backgroundColor: colors[0],
            textSize: 30,
            textColor: Color.WHITE,
            layoutConfig: layoutConfig().just(),
            onClick: () => {
              modal(this.context)
                .prompt({
                  msg: "This is Prompt.",
                  title: "Prompt title",
                  okLabel: "OkLabel",
                  cancelLabel: "CancelLabel",
                })
                .then(
                  (e) => {
                    modal(this.context).toast(`Clicked OK.Input:${e}`);
                  },
                  (e) => {
                    modal(this.context).toast(`Clicked Cancel.Input:${e}`);
                  }
                );
            },
          }),
        ],
        {
          layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
          gravity: Gravity.Center,
          space: 10,
        }
      ),
      {
        layoutConfig: layoutConfig().most(),
      }
    ).in(rootView);
  }
}
