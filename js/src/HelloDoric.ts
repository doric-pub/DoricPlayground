import { image, text, Gravity, Color, vlayout, layoutConfig, Panel, Group, IVLayout } from "doric"


@Entry
class HelloDoric extends Panel {
    build(root: Group) {
        vlayout(
            [
                image({
                    imageUrl: './favicon.ico'
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
                gravity: Gravity.Center
            }
        ).in(root)
    }
}