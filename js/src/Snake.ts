import { text, loge, log, ViewHolder, Stack, ViewModel, Gravity, Text, Color, HLayout, VLayout, Group, VMPanel, LayoutSpec, vlayout, hlayout, takeNonNull, stack, navigator, navbar, layoutConfig, IHLayout, popover, IVLayout, storage } from "doric";

const colors = {
    bgColor: Color.parse('#FFB7BFAC'),
    snakeColor: Color.BLACK,
    foodColor: Color.BLACK,
}

const hignScoreKey = "SnakeHignScore"

function scoreFormat(score: number) {
    return `${Math.floor((score % 1000) / 100)}${Math.floor((score % 100) / 10)}${Math.floor(score % 10)}`
}

type SnakeNode = {
    x: number
    y: number
    prev?: SnakeNode
    next?: SnakeNode
}


enum Direction {
    left = 0,
    right = 1,
    up = 2,
    down = 3,
}

enum State {
    idel,
    run,
    fail,
}

class SnakeModel {
    state = State.idel
    direction = Direction.right
    highScore = 0
    width: number
    height: number

    constructor(w: number, h: number) {
        this.width = w
        this.height = h
    }
    food = { x: -1, y: -1 }

    head: SnakeNode = {
        x: 0,
        y: 0,
    }

    refreshFood() {
        this.food.x = Math.floor(Math.random() * (this.width - 1))
        this.food.y = Math.floor(Math.random() * (this.height - 1))
    }

    get tail() {
        let node = this.head
        while (node.next !== undefined) {
            node = node.next
        }
        return node
    }
    get score() {
        let node = this.head
        let n = 0
        while (node.next !== undefined) {
            n++
            node = node.next
        }
        return n
    }

    forward(node: SnakeNode) {
        switch (this.direction) {
            case Direction.left:
                node.x -= 1
                break;
            case Direction.right:
                node.x += 1
                break;
            case Direction.up:
                node.y -= 1
                break;
            case Direction.down:
                node.y += 1
                break;
        }
    }
    step() {
        if (this.state !== State.run) {
            return
        }
        let tail = this.tail
        while (tail.prev != undefined) {
            tail.x = tail.prev.x
            tail.y = tail.prev.y
            tail = tail.prev
        }
        this.forward(this.head)
        if (this.head.x < 0 || this.head.x >= this.width
            || this.head.y < 0 || this.head.y >= this.height) {
            //If out of bound
            this.state = State.fail
        } else if (this.head.x == this.food.x && this.head.y == this.food.y) {
            //If eat food
            let head: SnakeNode = { x: this.food.x, y: this.food.y }
            this.forward(head)
            this.head.prev = head
            head.next = this.head
            this.head = head
            this.refreshFood()
            this.highScore = Math.max(this.highScore, this.score)
            storage(context).setItem(hignScoreKey, `${this.highScore}`)
        }
        if (this.crashAtSelf()) {
            //If crash at self
            this.state = State.fail
        }
    }

    crashAtSelf() {
        let cur = this.head.next
        while (cur !== undefined) {
            if (cur.x == this.head.x && cur.y == this.head.y) {
                return true
            }
            cur = cur.next
        }
        return false
    }

    reset() {
        this.direction = Direction.right
        this.state = State.run
        this.head.x = 0
        this.head.y = 0
        this.head.next = undefined
        this.refreshFood()
    }
}

class SnakeView extends ViewHolder {

    panel!: Stack
    start?: Text
    up?: Text
    down?: Text
    left?: Text
    right?: Text
    score!: Text
    high !: Text
    titleZone() {
        return hlayout([
            text({
                text: "点击下方开始游戏",
                textSize: 20,
            }),
        ]).apply({
            layoutConfig: layoutConfig().just().configWidth(LayoutSpec.MOST),
            height: 50,
            gravity: Gravity.Center,
        } as IHLayout)
    }

    panelZone() {
        return vlayout([
            stack([
                this.panel = stack([]).apply({
                    layoutConfig: layoutConfig().just(),
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
                    color: Color.BLACK,
                },
                layoutConfig: layoutConfig().fit().configAlignmnet(Gravity.Center),
            }),
            hlayout([
                text({
                    text: "SCORE",
                    textSize: 20,
                }),
                this.score = text({
                    text: "000",
                    textSize: 20,
                }),
                (new Stack()).apply({
                    layoutConfig: layoutConfig().just().configWeight(1),
                }),
                text({
                    text: "HIGH",
                    textSize: 20,
                }),
                this.high = text({
                    text: "000",
                    textSize: 20,
                }),
            ]).apply({
                layoutConfig: layoutConfig().fit()
                    .configWidth(LayoutSpec.MOST)
                    .configAlignmnet(Gravity.Left).configMargin({ left: 40, right: 40 }),
                space: 10,
            } as IHLayout),
        ]).apply({
            layoutConfig: layoutConfig().fit().configWidth(LayoutSpec.MOST),
            backgroundColor: colors.bgColor,
            padding: {
                top: 20,
                bottom: 20,
            }
        })
    }
    controlZone() {
        return vlayout([
            hlayout([
                text({
                    width: 50,
                    height: 50,
                    text: "↑",
                    textSize: 30,
                    textAlignment: new Gravity().center(),
                    backgroundColor: Color.parse('#ffff00'),
                    layoutConfig: {
                        widthSpec: LayoutSpec.JUST,
                        heightSpec: LayoutSpec.JUST,
                    },
                }).also(it => this.up = it)
            ]).also(it => {
                it.layoutConfig = {
                    widthSpec: LayoutSpec.FIT,
                    heightSpec: LayoutSpec.FIT,
                }
            }),
            hlayout([
                text({
                    width: 50,
                    height: 50,
                    text: "←",
                    textSize: 30,
                    textAlignment: new Gravity().center(),
                    backgroundColor: Color.parse('#ffff00'),
                    layoutConfig: {
                        widthSpec: LayoutSpec.JUST,
                        heightSpec: LayoutSpec.JUST,
                    },
                }).also(it => this.left = it),
                text({
                    width: 50,
                    height: 50,
                    text: "↓",
                    textSize: 30,
                    textAlignment: new Gravity().center(),
                    backgroundColor: Color.parse('#ffff00'),
                    layoutConfig: {
                        widthSpec: LayoutSpec.JUST,
                        heightSpec: LayoutSpec.JUST,
                    },
                }).also(it => this.down = it),
                text({
                    width: 50,
                    height: 50,
                    text: "→",
                    textSize: 30,
                    textAlignment: new Gravity().center(),
                    backgroundColor: Color.parse('#ffff00'),
                    layoutConfig: {
                        widthSpec: LayoutSpec.JUST,
                        heightSpec: LayoutSpec.JUST,
                    },
                }).also(it => this.right = it),
            ]).also(it => {
                it.layoutConfig = {
                    widthSpec: LayoutSpec.FIT,
                    heightSpec: LayoutSpec.FIT,
                }
                it.space = 10
            }),
        ]).also(controlArea => {
            controlArea.gravity = new Gravity().centerX()
            controlArea.space = 10
            controlArea.layoutConfig = {
                alignment: new Gravity().centerX(),
                widthSpec: LayoutSpec.FIT,
                heightSpec: LayoutSpec.FIT,
            }
        })
    }
    build(root: Group): void {
        root.backgroundColor = Color.WHITE
        vlayout([
            this.titleZone(),
            this.panelZone(),
            hlayout([
                this.start = text({
                    text: "开始",
                    textSize: 30,
                    layoutConfig: {
                        widthSpec: LayoutSpec.FIT,
                        heightSpec: LayoutSpec.FIT,
                    },
                }),
            ]).apply({
                layoutConfig: {
                    widthSpec: LayoutSpec.FIT,
                    heightSpec: LayoutSpec.FIT,
                }
            }),
            this.controlZone(),
        ]).also(it => {
            it.layoutConfig = layoutConfig().most()
            it.gravity = new Gravity().centerX()
        }).in(root)
    }

    bind(state: SnakeModel): void {
        let node: SnakeNode | undefined = state.head
        let nodes: SnakeNode[] = []
        while (node != undefined) {
            nodes.push(node)
            node = node.next
        }
        nodes.push(state.food)
        nodes.forEach((e, index) => {
            let item = this.panel.children[index]
            if (item === undefined) {
                item = stack([
                    stack([]).apply({
                        layoutConfig: layoutConfig().just().configAlignmnet(Gravity.Center),
                        width: 9,
                        height: 9,
                    })

                ]).apply({
                    layoutConfig: layoutConfig().just(),
                    width: 10,
                    height: 10,
                }).in(this.panel)
            }
            takeNonNull((item as Stack).children[0])(v => {
                if (index === nodes.length - 1) {
                    v.backgroundColor = colors.foodColor
                } else {
                    v.backgroundColor = colors.snakeColor
                }
            })
            item.x = e.x * 10
            item.y = e.y * 10
        })

        if (nodes.length < this.panel.children.length) {
            this.panel.children.length = nodes.length
        }
        this.score.text = `${scoreFormat(state.score)}`
        this.high.text = `${scoreFormat(state.highScore)}`
    }
}

class SnakeVM extends ViewModel<SnakeModel, SnakeView>{
    timerId?: any

    start = () => {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
        }
        this.updateState(it => it.reset())
        this.timerId = setInterval(() => {
            this.updateState(it => it.step())
            if (this.getState().state === State.fail) {
                this.stop()
            }
        }, 500)
    }

    stop = () => {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
            this.timerId = undefined
        }
    }

    left = () => {
        this.updateState(it => it.direction = Direction.left)
    }

    right = () => {
        this.updateState(it => it.direction = Direction.right)
    }

    up = () => {
        this.updateState(it => it.direction = Direction.up)
    }

    down = () => {
        this.updateState(it => it.direction = Direction.down)
    }

    onAttached(state: SnakeModel, v: SnakeView) {
        takeNonNull(v.start)(it => it.onClick = this.start)
        takeNonNull(v.left)(it => it.onClick = this.left)
        takeNonNull(v.right)(it => it.onClick = this.right)
        takeNonNull(v.up)(it => it.onClick = this.up)
        takeNonNull(v.down)(it => it.onClick = this.down)
        v.panel.apply({
            width: state.width * 10,
            height: state.height * 10,
        })

        storage(context).getItem(hignScoreKey).then(r => {
            this.updateState(s => {
                if (r) {
                    s.highScore = parseInt(r)
                } else {
                    s.highScore = 0
                }
            })
        })
    }
    onBind(state: SnakeModel, v: SnakeView) {
        v.bind(state)
        if (state.state === State.fail) {
            popover(context).show(
                vlayout([
                    text({
                        text: "游戏结束",
                        textSize: 40,
                    }),
                    hlayout([
                        text({
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
                                color: Color.BLACK,
                            },
                            onClick: () => {
                                popover(context).dismiss()
                                this.start()
                            },
                        }),
                        text({
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
                                color: Color.BLACK,
                            },
                            onClick: () => {
                                popover(context).dismiss()
                                navigator(context).pop()
                            },
                        }),
                    ]).apply({
                        space: 100,
                        layoutConfig: layoutConfig().fit().configMargin({
                            bottom: 20
                        }),
                    } as IHLayout),
                ]).apply({
                    layoutConfig: layoutConfig().fit().configWidth(LayoutSpec.MOST).configMargin({
                        top: 300,
                        left: 20,
                        right: 20,
                    }),
                    border: {
                        width: 1,
                        color: Color.BLACK,
                    },
                    backgroundColor: colors.bgColor,
                    gravity: Gravity.Center,
                } as IVLayout)
            )
        }
    }
}
@Entry
class SnakePanel extends VMPanel<SnakeModel, SnakeView>{
    getViewModelClass() {
        return SnakeVM
    }
    getState(): SnakeModel {
        return new SnakeModel(30, 30)
    }
    getViewHolderClass() {
        return SnakeView
    }
    onShow() {
        navbar(context).setTitle("贪吃蛇")
    }
}