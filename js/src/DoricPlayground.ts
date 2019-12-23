import { Panel, Group, vlayout, layoutConfig, Gravity, IVLayout, text, Text, Color, navbar } from "doric";

@Entry
class DoricPlayground extends Panel {
    onShow() {
        navbar(context).setTitle("DoricPlayground")
    }
    build(rootView: Group): void {
        let number: Text
        let count = 0
        vlayout([
            number = text({
                textSize: 40,
                text: '0',
            }),
            text({
                text: "Click to count",
                textSize: 20,
                backgroundColor: Color.parse('#70a1ff'),
                textColor: Color.WHITE,
                onClick: () => {
                    number.text = `${++count}`
                },
                layoutConfig: layoutConfig().just(),
                width: 200,
                height: 50,
            }),
        ])
            .apply({
                layoutConfig: layoutConfig().just().configAligmnet(Gravity.Center),
                width: 200,
                height: 200,
                space: 20,
                border: {
                    color: Color.BLUE,
                    width: 1,
                },
                gravity: Gravity.Center,
            } as IVLayout)
            .in(rootView)
    }

}