'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function title(str) {
    return doric.text({
        text: str,
        layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
        textSize: 30,
        textColor: doric.Color.WHITE,
        backgroundColor: colors[1],
        textAlignment: doric.gravity().center(),
        height: 50,
    });
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
].map(e => doric.Color.parse(e));
function label(str) {
    return doric.text({
        text: str,
        textSize: 16,
    });
}
let PopoverDemo = class PopoverDemo extends doric.Panel {
    build(rootView) {
        doric.scroller(doric.vlayout([
            title("Popover Demo"),
            label('Popover').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: () => {
                    doric.popover(context).show(doric.text({
                        width: 200,
                        height: 50,
                        backgroundColor: colors[0],
                        textColor: doric.Color.WHITE,
                        layoutConfig: doric.layoutConfig().just().configAlignment(doric.Gravity.Center),
                        text: "This is PopOver Window",
                    }).also(v => {
                        let idx = 0;
                        v.onClick = () => {
                            v.backgroundColor = colors[(++idx) % colors.length];
                        };
                        doric.modal(context).toast('Dismissed after 3 seconds');
                        setTimeout(() => {
                            doric.popover(context).dismiss();
                        }, 3000);
                    }));
                }
            }),
        ], {
            layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT),
            gravity: doric.gravity().center(),
            space: 10,
        }), {
            layoutConfig: doric.layoutConfig().most(),
        }).in(rootView);
    }
};
PopoverDemo = __decorate([
    Entry
], PopoverDemo);
//# sourceMappingURL=Popover.js.map
