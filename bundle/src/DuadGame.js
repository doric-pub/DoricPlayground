'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class Cell {
    constructor(under, top) {
        this.under = under;
        this.top = top;
    }
}
class Item {
    constructor(value, color) {
        this.value = value;
        this.color = color;
    }
}
class DuadModel {
    constructor() {
        this.firstSelect = [];
    }
}
class DuadView extends doric.ViewHolder {
    constructor() {
        super(...arguments);
        this.cellWidth = 80;
        this.cellHeight = 80;
        this.cellMatrix = [];
    }
    cellViews() {
        let res = [];
        for (let i = 0; i < 6; i++) {
            let cols = [];
            this.cellMatrix.push([]);
            for (let j = 0; j < 5; j++) {
                let view = doric.stack([
                    (new doric.Text).also(it => {
                        it.width = this.cellWidth - 2;
                        it.height = this.cellHeight - 2;
                        it.textColor = doric.Color.WHITE;
                        it.textSize = 40;
                        it.layoutConfig = {
                            alignment: doric.gravity().center()
                        };
                    }),
                    (new doric.Stack).also(it => {
                        it.width = this.cellWidth - 2;
                        it.height = this.cellHeight - 2;
                        it.backgroundColor = doric.Color.LTGRAY;
                        it.layoutConfig = {
                            alignment: doric.gravity().center()
                        };
                        it.onClick = () => {
                            this.cellClick(i, j);
                        };
                    })
                ], {
                    width: this.cellWidth,
                    height: this.cellHeight,
                    layoutConfig: {
                        alignment: doric.gravity().center()
                    }
                });
                cols.push(view);
                this.cellMatrix[i].push(new Cell(view.children[0], view.children[1]));
            }
            let row = doric.hlayout(cols, {
                layoutConfig: {
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT
                }
            });
            res.push(row);
        }
        return res;
    }
    revealAnim(view) {
        let animation = new doric.ScaleAnimation;
        animation.duration = 500;
        animation.fromScaleX = 1;
        animation.toScaleX = 0;
        return view.doAnimation(context, animation).then(() => {
            view.width = 0;
        });
    }
    coverAnim(views) {
        let animation = new doric.ScaleAnimation;
        animation.duration = 500;
        animation.fromScaleX = 0;
        animation.toScaleX = 1;
        let pro0 = views[0].doAnimation(context, animation).then(() => {
            views[0].width = this.cellWidth - 2;
        });
        let pro1 = views[1].doAnimation(context, animation).then(() => {
            views[1].width = this.cellWidth - 2;
        });
        return Promise.all([pro0, pro1]);
    }
    bind(state) {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                let item = state.matrix[i][j];
                let text = this.cellMatrix[i][j].under;
                text.text = item.value.toString();
                text.backgroundColor = item.color;
            }
        }
    }
    build(root) {
        doric.vlayout(this.cellViews(), {
            layoutConfig: doric.layoutConfig().most(),
            gravity: doric.Gravity.Center,
        }).in(root);
    }
}
class DuadVM extends doric.ViewModel {
    constructor() {
        super(...arguments);
        this.revealing = false;
        this.covering = false;
    }
    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }
    generateMatrix() {
        let colors = [doric.Color.RED, doric.Color.parse('#9900FF'), doric.Color.BLUE];
        let values = [];
        for (let i = 1; i <= 5; i++) {
            values.push(i);
        }
        this.shuffle(colors);
        this.shuffle(values);
        let items = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                let item = new Item(values[j], colors[i]);
                items.push(item, item);
            }
        }
        this.shuffle(items);
        let res = [];
        let idx = 0;
        for (let i = 0; i < 6; i++) {
            let tmp = [];
            for (let j = 0; j < 5 && idx < 30; j++) {
                tmp.push(items[idx++]);
            }
            res.push(tmp);
        }
        return res;
    }
    generateReveal(v) {
        let res = [];
        for (let i = 0; i < 6; i++) {
            let row = [];
            for (let j = 0; j < 5; j++) {
                row.push(v);
            }
            res.push(row);
        }
        return res;
    }
    checkWon(s) {
        let won = true;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                if (!s.reveal[i][j]) {
                    won = false;
                    break;
                }
            }
        }
        if (won) {
            doric.modal(context).toast('Bingo!', doric.Gravity.Center);
        }
    }
    onAttached(state, vh) {
        state.matrix = this.generateMatrix();
        state.reveal = this.generateReveal(false);
        vh.cellClick = (i, j) => {
            if (this.revealing || this.covering) {
                return;
            }
            state.reveal[i][j] = true;
            let revealTop = vh.cellMatrix[i][j].top;
            this.revealing = true;
            vh.revealAnim(revealTop).then(() => {
                this.revealing = false;
            });
            setTimeout(() => {
                if (state.firstSelect.length < 2) {
                    state.firstSelect = [i, j];
                }
                else {
                    let firTop = vh.cellMatrix[state.firstSelect[0]][state.firstSelect[1]].top;
                    let fir = state.matrix[state.firstSelect[0]][state.firstSelect[1]];
                    let sec = state.matrix[i][j];
                    if (fir.value != sec.value || fir.color != sec.color) {
                        state.reveal[state.firstSelect[0]][state.firstSelect[1]] = false;
                        state.reveal[i][j] = false;
                        this.covering = true;
                        vh.coverAnim([firTop, revealTop]).then(() => {
                            this.covering = false;
                        });
                    }
                    else {
                        this.checkWon(state);
                    }
                    state.firstSelect = [];
                }
            }, 500);
        };
    }
    onBind(state, vh) {
        vh.bind(state);
    }
}
let DuadPanel = class DuadPanel extends doric.VMPanel {
    getViewHolderClass() {
        return DuadView;
    }
    getViewModelClass() {
        return DuadVM;
    }
    getState() {
        return new DuadModel();
    }
};
DuadPanel = __decorate([
    Entry
], DuadPanel);
//# sourceMappingURL=DuadGame.js.map
