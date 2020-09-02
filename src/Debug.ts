import {
  Group,
  vlayout,
  layoutConfig,
  text,
  navbar,
  Gravity,
  Color,
  VMPanel,
  ViewHolder,
  VLayout,
  ViewModel,
} from "doric";
interface DebugState {
  debug: boolean;
}
class DebugVH extends ViewHolder {
  content?: VLayout;
  build(root: Group) {
    this.content = vlayout([], {
      layoutConfig: layoutConfig().most(),
      gravity: Gravity.Center,
    }).in(root);
  }
}
class DebugVM extends ViewModel<DebugState, DebugVH> {
  onAttached(state: DebugState, vh: DebugVH) {
    context.callNative("qrcode", "isDebug").then((ret: boolean) => {
      this.updateState((state) => (state.debug = ret));
    });
  }
  onBind(state: DebugState, vh: DebugVH) {
    const content = vh.content;
    if (content) {
      content.removeAllChildren();
      vlayout(
        state.debug
          ? [
              text({
                text: "您已连接终端调试",
                textSize: 20,
                maxLines: 100,
              }),
              text({
                text: "请修改目标源代码并保存",
                textSize: 20,
                maxLines: 100,
              }),
              text({
                text: "或者,打开Doric调试面板",
                textSize: 20,
                maxLines: 100,
                textColor: Color.BLUE,
                underline: true,
                onClick: async () => {
                  await context.callNative("qrcode", "debug");
                },
              }),
            ]
          : [
              text({
                text: "您已进入Doric开发页",
                textSize: 20,
                maxLines: 100,
              }),
              text({
                text: "请按以下步骤执行",
                textSize: 20,
                maxLines: 100,
              }),
              text({
                text: "1. 终端运行`doric dev`",
                textSize: 20,
                maxLines: 100,
              }),

              (() => {
                const ret = text({
                  text: "2. 点击扫描终端二维码,连接终端",
                  textSize: 20,
                  maxLines: 100,
                  textColor: Color.BLUE,
                  underline: true,
                  onClick: async () => {
                    await context.callNative("qrcode", "debug");
                  },
                });
                return ret;
              })(),

              text({
                text: "3.修改目标源代码并保存",
                textSize: 20,
                maxLines: 100,
              }),
            ],
        {
          layoutConfig: layoutConfig().fit(),
          backgroundColor: Color.WHITE,
          space: 20,
        }
      ).in(content);
    }
  }
}
@Entry
class DebugPanel extends VMPanel<DebugState, DebugVH> {
  onShow() {
    navbar(context).setTitle("Doric Dev");
    context.callNative("qrcode", "isDebug").then((ret: boolean) => {
      this.getViewModel()?.updateState((state) => (state.debug = ret));
    });
  }
  getViewModelClass() {
    return DebugVM;
  }
  getState() {
    return {
      debug: false,
    };
  }
  getViewHolderClass() {
    return DebugVH;
  }
}
