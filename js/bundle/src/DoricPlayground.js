'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let DoricPlayground = class DoricPlayground extends doric.Panel {
    onShow() {
        doric.navbar(context).setTitle("DoricPlayground");
    }
    build(rootView) {
        let number;
        let count = 0;
        doric.vlayout([
            number = doric.text({
                textSize: 40,
                text: '0',
            }),
            doric.text({
                text: "Click to count",
                textSize: 20,
                backgroundColor: doric.Color.parse('#70a1ff'),
                textColor: doric.Color.WHITE,
                onClick: () => {
                    number.text = `${++count}`;
                },
                layoutConfig: doric.layoutConfig().just(),
                width: 200,
                height: 50,
            }),
        ])
            .apply({
            layoutConfig: doric.layoutConfig().just().configAligmnet(doric.Gravity.Center),
            width: 200,
            height: 200,
            space: 20,
            border: {
                color: doric.Color.BLUE,
                width: 1,
            },
            gravity: doric.Gravity.Center,
        })
            .in(rootView);
    }
};
DoricPlayground = __decorate([
    Entry
], DoricPlayground);
//# sourceMappingURL=DoricPlayground.js.map
