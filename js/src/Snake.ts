import { text, loge, log, ViewHolder, Stack, ViewModel, Gravity, Text, Color, HLayout, VLayout, Group, VMPanel, LayoutSpec, vlayout, hlayout, takeNonNull, stack, navigator, navbar, layoutConfig, IHLayout, popover, IVLayout, storage, View, image, Image } from "doric";

const colors = {
    bgColor: Color.parse('#FFB7BFAC'),
    snakeColor: Color.BLACK,
    foodColor: Color.BLACK,
}

const hignScoreKey = "SnakeHignScore"

const arrow = "data:image/png;base64,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"

const startIcon = "data:image/png;base64,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"

const pauseIcon = "data:image/png;base64,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"

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
    paused,
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
    up!: View
    start!: Image
    down!: View
    left!: View
    right?: View
    score!: Text
    high !: Text

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
                this.up = image({
                    layoutConfig: layoutConfig().just(),
                    width: 50,
                    height: 50,
                    imageBase64: arrow
                })
            ]),
            hlayout([
                this.left = image({
                    layoutConfig: layoutConfig().just(),
                    width: 50,
                    height: 50,
                    imageBase64: arrow,
                    rotation: -0.5,
                }),
                this.start = image({
                    layoutConfig: layoutConfig().just(),
                    width: 50,
                    height: 50,
                    imageBase64: startIcon,
                }),
                this.right = image({
                    layoutConfig: layoutConfig().just(),
                    width: 50,
                    height: 50,
                    imageBase64: arrow,
                    rotation: 0.5,
                }),
            ]).also(it => {
                it.space = 10
            }),
            hlayout([
                this.down = image({
                    layoutConfig: layoutConfig().just(),
                    width: 50,
                    height: 50,
                    imageBase64: arrow,
                    rotation: 1,
                })
            ]),
        ]).also(controlArea => {
            controlArea.space = 10
            controlArea.gravity = new Gravity().centerX()
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
            this.panelZone(),
            this.controlZone(),
        ]).also(it => {
            it.layoutConfig = layoutConfig().most()
            it.gravity = new Gravity().centerX()
            it.space = 50
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
        this.start.imageBase64 = state.state === State.run ? pauseIcon : startIcon
    }
}

class SnakeVM extends ViewModel<SnakeModel, SnakeView>{
    timerId?: any
    timeInterval = 500
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
        }, this.timeInterval)
    }

    pause = () => {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
        }
        this.updateState(it => it.state = State.paused)
    }

    resume = () => {
        if (this.timerId !== undefined) {
            clearInterval(this.timerId)
        }
        this.updateState(it => it.state = State.run)
        this.timerId = setInterval(() => {
            this.updateState(it => it.step())
            if (this.getState().state === State.fail) {
                this.stop()
            }
        }, this.timeInterval)
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
        takeNonNull(v.start)(it => it.onClick = () => {
            if (state.state === State.run) {
                this.pause()
            } else if (state.state === State.paused) {
                this.resume()
            } else {
                this.start()
            }
        })
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
        if (state.state === State.run) {
            v.start
        }

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