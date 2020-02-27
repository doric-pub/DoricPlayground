'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class CounterView extends doric.ViewHolder {
    build(root) {
        doric.vlayout([
            this.number = doric.text({
                textSize: 40,
            }),
            this.counter = doric.text({
                text: "Click To Count",
                textSize: 20,
            }),
        ]).apply({
            layoutConfig: doric.layoutConfig().most(),
            gravity: doric.Gravity.Center,
            space: 20,
        }).in(root);
    }
}
class CounterVM extends doric.ViewModel {
    onAttached(s, vh) {
        vh.counter.onClick = () => {
            this.updateState(state => {
                state.count++;
            });
        };
    }
    onBind(s, vh) {
        vh.number.text = `${s.count}`;
    }
}
let MyPage = class MyPage extends doric.VMPanel {
    getViewHolderClass() {
        return CounterView;
    }
    getViewModelClass() {
        return CounterVM;
    }
    getState() {
        return {
            count: 0
        };
    }
};
MyPage = __decorate([
    Entry
], MyPage);
//# sourceMappingURL=Counter.js.map
