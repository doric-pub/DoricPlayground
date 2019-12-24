'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const colors = {
    bgColor: doric.Color.parse('#FFB7BFAC'),
    snakeColor: doric.Color.BLACK,
    foodColor: doric.Color.BLACK,
};
const hignScoreKey = "SnakeHignScore";
function scoreFormat(score) {
    return `${Math.floor((score % 1000) / 100)}${Math.floor((score % 100) / 10)}${Math.floor(score % 10)}`;
}
var Direction;
(function (Direction) {
    Direction[Direction["left"] = 0] = "left";
    Direction[Direction["right"] = 1] = "right";
    Direction[Direction["up"] = 2] = "up";
    Direction[Direction["down"] = 3] = "down";
})(Direction || (Direction = {}));
var State;
(function (State) {
    State[State["idel"] = 0] = "idel";
    State[State["run"] = 1] = "run";
    State[State["fail"] = 2] = "fail";
})(State || (State = {}));
class SnakeModel {
    constructor(w, h) {
        this.state = State.idel;
        this.direction = Direction.right;
        this.highScore = 0;
        this.food = { x: -1, y: -1 };
        this.head = {
            x: 0,
            y: 0,
        };
        this.width = w;
        this.height = h;
    }
    refreshFood() {
        this.food.x = Math.floor(Math.random() * (this.width - 1));
        this.food.y = Math.floor(Math.random() * (this.height - 1));
    }
    get tail() {
        let node = this.head;
        while (node.next !== undefined) {
            node = node.next;
        }
        return node;
    }
    get score() {
        let node = this.head;
        let n = 0;
        while (node.next !== undefined) {
            n++;
            node = node.next;
        }
        return n;
    }
    forward(node) {
        switch (this.direction) {
            case Direction.left:
                node.x -= 1;
                break;
            case Direction.right:
                node.x += 1;
                break;
            case Direction.up:
                node.y -= 1;
                break;
            case Direction.down:
                node.y += 1;
                break;
        }
    }
    step() {
        if (this.state !== State.run) {
            return;
        }
        let tail = this.tail;
        while (tail.prev != undefined) {
            tail.x = tail.prev.x;
            tail.y = tail.prev.y;
            tail = tail.prev;
        }
        this.forward(this.head);
        if (this.head.x < 0 || this.head.x >= this.width
            || this.head.y < 0 || this.head.y >= this.height) {
            //If out of bound
            this.state = State.fail;
        }
        else if (this.head.x == this.food.x && this.head.y == this.food.y) {
            //If eat food
            let head = { x: this.food.x, y: this.food.y };
            this.forward(head);
            this.head.prev = head;
            head.next = this.head;
            this.head = head;
            this.refreshFood();
            this.highScore = Math.max(this.highScore, this.score);
            doric.storage(context).setItem(hignScoreKey, `${this.highScore}`);
        }
        if (this.crashAtSelf()) {
            //If crash at self
            this.state = State.fail;
        }
    }
    crashAtSelf() {
        let cur = this.head.next;
        while (cur !== undefined) {
            if (cur.x == this.head.x && cur.y == this.head.y) {
                return true;
            }
            cur = cur.next;
        }
        return false;
    }
    reset() {
        this.direction = Direction.right;
        this.state = State.run;
        this.head.x = 0;
        this.head.y = 0;
        this.head.next = undefined;
        this.refreshFood();
    }
}
class SnakeView extends doric.ViewHolder {
    titleZone() {
        return doric.hlayout([
            doric.text({
                text: "点击下方开始游戏",
                textSize: 20,
            }),
        ]).apply({
            layoutConfig: doric.layoutConfig().just().configWidth(doric.LayoutSpec.MOST),
            height: 50,
            gravity: doric.Gravity.Center,
        });
    }
    panelZone() {
        return doric.vlayout([
            doric.stack([
                this.panel = doric.stack([]).apply({
                    layoutConfig: doric.layoutConfig().just(),
                }),
            ]).apply({
                padding: {
                    left: 2,
                    right: 2,
                    top: 2,
                    bottom: 2,
                },
                border: {
                    width: 1,
                    color: doric.Color.BLACK,
                },
                layoutConfig: doric.layoutConfig().fit().configAlignmnet(doric.Gravity.Center),
            }),
            doric.hlayout([
                doric.text({
                    text: "SCORE",
                    textSize: 20,
                }),
                this.score = doric.text({
                    text: "000",
                    textSize: 20,
                }),
                (new doric.Stack()).apply({
                    layoutConfig: doric.layoutConfig().just().configWeight(1),
                }),
                doric.text({
                    text: "HIGH",
                    textSize: 20,
                }),
                this.high = doric.text({
                    text: "000",
                    textSize: 20,
                }),
            ]).apply({
                layoutConfig: doric.layoutConfig().fit()
                    .configWidth(doric.LayoutSpec.MOST)
                    .configAlignmnet(doric.Gravity.Left).configMargin({ left: 40, right: 40 }),
                space: 10,
            }),
        ]).apply({
            layoutConfig: doric.layoutConfig().fit().configWidth(doric.LayoutSpec.MOST),
            backgroundColor: colors.bgColor,
            padding: {
                top: 20,
                bottom: 20,
            }
        });
    }
    controlZone() {
        return doric.vlayout([
            doric.hlayout([
                doric.text({
                    width: 50,
                    height: 50,
                    text: "↑",
                    textSize: 30,
                    textAlignment: new doric.Gravity().center(),
                    backgroundColor: doric.Color.parse('#ffff00'),
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.JUST,
                        heightSpec: doric.LayoutSpec.JUST,
                    },
                }).also(it => this.up = it)
            ]).also(it => {
                it.layoutConfig = {
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                };
            }),
            doric.hlayout([
                doric.text({
                    width: 50,
                    height: 50,
                    text: "←",
                    textSize: 30,
                    textAlignment: new doric.Gravity().center(),
                    backgroundColor: doric.Color.parse('#ffff00'),
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.JUST,
                        heightSpec: doric.LayoutSpec.JUST,
                    },
                }).also(it => this.left = it),
                doric.text({
                    width: 50,
                    height: 50,
                    text: "↓",
                    textSize: 30,
                    textAlignment: new doric.Gravity().center(),
                    backgroundColor: doric.Color.parse('#ffff00'),
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.JUST,
                        heightSpec: doric.LayoutSpec.JUST,
                    },
                }).also(it => this.down = it),
                doric.text({
                    width: 50,
                    height: 50,
                    text: "→",
                    textSize: 30,
                    textAlignment: new doric.Gravity().center(),
                    backgroundColor: doric.Color.parse('#ffff00'),
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.JUST,
                        heightSpec: doric.LayoutSpec.JUST,
                    },
                }).also(it => this.right = it),
            ]).also(it => {
                it.layoutConfig = {
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                };
                it.space = 10;
            }),
        ]).also(controlArea => {
            controlArea.gravity = new doric.Gravity().centerX();
            controlArea.space = 10;
            controlArea.layoutConfig = {
                alignment: new doric.Gravity().centerX(),
                widthSpec: doric.LayoutSpec.FIT,
                heightSpec: doric.LayoutSpec.FIT,
            };
        });
    }
    build(root) {
        root.backgroundColor = doric.Color.WHITE;
        doric.vlayout([
            this.titleZone(),
            this.panelZone(),
            doric.hlayout([
                this.start = doric.text({
                    text: "开始",
                    textSize: 30,
                    layoutConfig: {
                        widthSpec: doric.LayoutSpec.FIT,
                        heightSpec: doric.LayoutSpec.FIT,
                    },
                }),
            ]).apply({
                layoutConfig: {
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                }
            }),
            this.controlZone(),
        ]).also(it => {
            it.layoutConfig = doric.layoutConfig().most();
            it.gravity = new doric.Gravity().centerX();
        }).in(root);
    }
    bind(state) {
        let node = state.head;
        let nodes = [];
        while (node != undefined) {
            nodes.push(node);
            node = node.next;
        }
        nodes.push(state.food);
        nodes.forEach((e, index) => {
            let item = this.panel.children[index];
            if (item === undefined) {
                item = doric.stack([
                    doric.stack([]).apply({
                        layoutConfig: doric.layoutConfig().just().configAlignmnet(doric.Gravity.Center),
                        width: 9,
                        height: 9,
                    })
                ]).apply({
                    layoutConfig: doric.layoutConfig().just(),
                    width: 10,
                    height: 10,
                }).in(this.panel);
            }
            doric.takeNonNull(item.children[0])(v => {
                if (index === nodes.length - 1) {
                    v.backgroundColor = colors.foodColor;
                }
                else {
                    v.backgroundColor = colors.snakeColor;
                }
            });
            item.x = e.x * 10;
            item.y = e.y * 10;
        });
        if (nodes.length < this.panel.children.length) {
            this.panel.children.length = nodes.length;
        }
        this.score.text = `${scoreFormat(state.score)}`;
        this.high.text = `${scoreFormat(state.highScore)}`;
    }
}
class SnakeVM extends doric.ViewModel {
    constructor() {
        super(...arguments);
        this.start = () => {
            if (this.timerId !== undefined) {
                clearInterval(this.timerId);
            }
            this.updateState(it => it.reset());
            this.timerId = setInterval(() => {
                this.updateState(it => it.step());
                if (this.getState().state === State.fail) {
                    this.stop();
                }
            }, 500);
        };
        this.stop = () => {
            if (this.timerId !== undefined) {
                clearInterval(this.timerId);
                this.timerId = undefined;
            }
        };
        this.left = () => {
            this.updateState(it => it.direction = Direction.left);
        };
        this.right = () => {
            this.updateState(it => it.direction = Direction.right);
        };
        this.up = () => {
            this.updateState(it => it.direction = Direction.up);
        };
        this.down = () => {
            this.updateState(it => it.direction = Direction.down);
        };
    }
    onAttached(state, v) {
        doric.takeNonNull(v.start)(it => it.onClick = this.start);
        doric.takeNonNull(v.left)(it => it.onClick = this.left);
        doric.takeNonNull(v.right)(it => it.onClick = this.right);
        doric.takeNonNull(v.up)(it => it.onClick = this.up);
        doric.takeNonNull(v.down)(it => it.onClick = this.down);
        v.panel.apply({
            width: state.width * 10,
            height: state.height * 10,
        });
        doric.storage(context).getItem(hignScoreKey).then(r => {
            this.updateState(s => {
                if (r) {
                    s.highScore = parseInt(r);
                }
                else {
                    s.highScore = 0;
                }
            });
        });
    }
    onBind(state, v) {
        v.bind(state);
        if (state.state === State.fail) {
            doric.popover(context).show(doric.vlayout([
                doric.text({
                    text: "游戏结束",
                    textSize: 40,
                }),
                doric.hlayout([
                    doric.text({
                        text: "继续",
                        textSize: 30,
                        padding: {
                            left: 20,
                            right: 20,
                            top: 10,
                            bottom: 10,
                        },
                        border: {
                            width: 1,
                            color: doric.Color.BLACK,
                        },
                        onClick: () => {
                            doric.popover(context).dismiss();
                            this.start();
                        },
                    }),
                    doric.text({
                        text: "退出",
                        textSize: 30,
                        padding: {
                            left: 20,
                            right: 20,
                            top: 10,
                            bottom: 10,
                        },
                        border: {
                            width: 1,
                            color: doric.Color.BLACK,
                        },
                        onClick: () => {
                            doric.popover(context).dismiss();
                            doric.navigator(context).pop();
                        },
                    }),
                ]).apply({
                    space: 100,
                    layoutConfig: doric.layoutConfig().fit().configMargin({
                        bottom: 20
                    }),
                }),
            ]).apply({
                layoutConfig: doric.layoutConfig().fit().configWidth(doric.LayoutSpec.MOST).configMargin({
                    top: 300,
                    left: 20,
                    right: 20,
                }),
                border: {
                    width: 1,
                    color: doric.Color.BLACK,
                },
                backgroundColor: colors.bgColor,
                gravity: doric.Gravity.Center,
            }));
        }
    }
}
let SnakePanel = class SnakePanel extends doric.VMPanel {
    getViewModelClass() {
        return SnakeVM;
    }
    getState() {
        return new SnakeModel(30, 30);
    }
    getViewHolderClass() {
        return SnakeView;
    }
    onShow() {
        doric.navbar(context).setTitle("贪吃蛇");
    }
};
SnakePanel = __decorate([
    Entry
], SnakePanel);
//# sourceMappingURL=Snake.js.map
