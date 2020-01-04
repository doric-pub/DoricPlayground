import { Group, Panel, popover, text, gravity, Color, LayoutSpec, vlayout, Gravity, scroller, layoutConfig, IVLayout, modal, IText } from "doric";

function title(str: string) {
    return text({
        text: str,
        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
        textSize: 30,
        textColor: Color.WHITE,
        backgroundColor: colors[1],
        textAlignment: gravity().center(),
        height: 50,
    })
}

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
].map(e => Color.parse(e))

function label(str: string) {
    return text({
        text: str,
        textSize: 16,
    })
}

@Entry
class PopoverDemo extends Panel {
    build(rootView: Group): void {
        scroller(vlayout([
            title("Popover Demo"),
            label('Popover').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    popover(context).show(text({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
                        text: "This is PopOver Window",
                    }).also(v => {
                        let idx = 0
                        v.onClick = () => {
                            v.backgroundColor = colors[(++idx) % colors.length]
                        }
                        modal(context).toast('Dismissed after 3 seconds')
                        setTimeout(() => {
                            popover(context).dismiss()
                        }, 3000)
                    }))
                }
            } as IText),
        ]).apply({
            layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
            gravity: gravity().center(),
            space: 10,
        } as IVLayout)).apply({
            layoutConfig: layoutConfig().most(),
        }).in(rootView)
    }
}