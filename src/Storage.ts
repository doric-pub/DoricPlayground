import { storage, Panel, scroller, vlayout, text, layoutConfig, LayoutSpec, Color, gravity, IVLayout, Group, IText, modal, Text, log, loge } from "doric";
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
].map(e => Color.parse(e))

export function label(str: string) {
    return text({
        text: str,
        textSize: 16,
    })
}

const storedKey = 'StoredKey'
const zone = 'StorageDemo'
@Entry
class StorageDemo extends Panel {
    stored!: Text

    update() {
        storage(context).getItem(storedKey, zone).then(e => {
            this.stored.text = e || ""
            log('Called in then')
        })
    }

    build(root: Group) {
        scroller(
            vlayout(
                [
                    text({
                        text: "Storage Demo",
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                        textSize: 30,
                        textColor: Color.WHITE,
                        backgroundColor: colors[1],
                        textAlignment: gravity().center(),
                        height: 50,
                    }),
                    label('Stored'),
                    text({
                        layoutConfig: layoutConfig().configWidth(LayoutSpec.MOST),
                        textSize: 20,
                        textColor: Color.WHITE,
                        backgroundColor: colors[3],
                        textAlignment: gravity().center(),
                        height: 50,
                    }).also(it => this.stored = it),
                    label('store a value').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            storage(context).getItem(storedKey, zone).then(e => {
                                modal(context).prompt({
                                    text: e,
                                    title: "Please input text to store",
                                    defaultText: "Default Value",
                                }).then(text => {
                                    storage(context).setItem(storedKey, text, zone).then(() => {
                                        this.update()
                                    })
                                })
                            })
                        },
                    } as IText),
                    label('remove value').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            storage(context).remove(storedKey, zone).then(e => {
                                this.update()
                            })
                        },
                    } as IText),
                    label('clear values').apply({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textSize: 30,
                        textColor: Color.WHITE,
                        layoutConfig: layoutConfig().just(),
                        onClick: () => {
                            storage(context).clear(zone).then(e => {
                                this.update()
                            })
                        },
                    } as IText),
                ],
                {
                    layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
                    gravity: gravity().center(),
                    space: 10,
                }),
            {
                layoutConfig: layoutConfig().most(),
            }
        ).in(root)
        this.update()
    }

}