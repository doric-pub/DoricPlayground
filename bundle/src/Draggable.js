'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let DraggableDemo = class DraggableDemo extends doric.Panel {
    build(root) {
        let textView;
        let drag = doric.draggable(textView = doric.text({
            layoutConfig: doric.layoutConfig().just().configAlignment(doric.Gravity.Center),
            width: 100,
            height: 30,
            textColor: doric.Color.RED,
            onClick: () => {
                doric.modal(context).toast('Clicked');
            }
        }), {
            onDrag: (x, y) => {
                textView.text = "x: " + x.toFixed(0) + " y: " + y.toFixed(0);
            },
            layoutConfig: doric.layoutConfig().just(),
            width: 100,
            height: 100,
            backgroundColor: doric.Color.WHITE
        });
        doric.vlayout([
            doric.text({
                text: "Storage Demo",
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: doric.Color.parse("#7bed9f"),
                textAlignment: doric.gravity().center(),
                height: 50,
            }),
            doric.stack([
                drag,
            ], {
                layoutConfig: doric.layoutConfig().most()
            })
        ], {
            layoutConfig: doric.layoutConfig().most(),
            backgroundColor: doric.Color.BLACK
        })
            .in(root);
    }
};
DraggableDemo = __decorate([
    Entry
], DraggableDemo);
//# sourceMappingURL=Draggable.js.map
