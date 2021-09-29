import {
  BridgeContext,
  Color,
  Gravity,
  gravity,
  Group,
  HLayout,
  hlayout,
  layoutConfig,
  LayoutSpec,
  modal,
  ScaleAnimation,
  stack,
  Stack,
  Text,
  View,
  ViewHolder,
  ViewModel,
  vlayout,
  VMPanel,
} from "doric";

class Cell {
  under?: Text;
  top?: View;

  constructor(under: Text, top: View) {
    this.under = under;
    this.top = top;
  }
}

class Item {
  value?: number;
  color?: Color;

  constructor(value: number, color: Color) {
    this.value = value;
    this.color = color;
  }
}

class DuadModel {
  matrix?: Item[][];
  reveal?: boolean[][];
  firstSelect: number[] = [];
}

class DuadView extends ViewHolder {
  private cellWidth = 80;
  private cellHeight = 80;

  cellMatrix: Cell[][] = [];

  cellClick?: { (row: number, col: number): void };

  private cellViews(): HLayout[] {
    let res: HLayout[] = [];
    for (let i = 0; i < 6; i++) {
      let cols: Stack[] = [];
      this.cellMatrix.push([]);
      for (let j = 0; j < 5; j++) {
        let view = stack(
          [
            new Text().also((it) => {
              it.width = this.cellWidth - 2;
              it.height = this.cellHeight - 2;
              it.textColor = Color.WHITE;
              it.textSize = 40;
              it.layoutConfig = {
                alignment: gravity().center(),
              };
            }),
            new Stack().also((it) => {
              it.width = this.cellWidth - 2;
              it.height = this.cellHeight - 2;
              it.backgroundColor = Color.LTGRAY;
              it.layoutConfig = {
                alignment: gravity().center(),
              };
              it.onClick = () => {
                this.cellClick!(i, j);
              };
            }),
          ],
          {
            width: this.cellWidth,
            height: this.cellHeight,
            layoutConfig: {
              alignment: gravity().center(),
            },
          }
        );
        cols.push(view);
        this.cellMatrix[i].push(
          new Cell(view.children[0] as Text, view.children[1])
        );
      }
      let row = hlayout(cols, {
        layoutConfig: {
          widthSpec: LayoutSpec.FIT,
          heightSpec: LayoutSpec.FIT,
        },
      });
      res.push(row);
    }
    return res;
  }

  revealAnim(view: View): Promise<void> {
    let animation = new ScaleAnimation();
    animation.duration = 500;
    animation.fromScaleX = 1;
    animation.toScaleX = 0;
    return view.doAnimation(context, animation).then(() => {
      view.width = 0;
    });
  }

  coverAnim(views: View[]): Promise<[void, void]> {
    let animation = new ScaleAnimation();
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

  bind(state: DuadModel) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        let item = state.matrix![i][j];
        let text: Text = this.cellMatrix[i][j].under!;
        text.text = item.value!.toString();
        text.backgroundColor = item.color;
      }
    }
  }

  build(root: Group) {
    vlayout(this.cellViews(), {
      layoutConfig: layoutConfig().most(),
      gravity: Gravity.Center,
    }).in(root);
  }
}

class DuadVM extends ViewModel<DuadModel, DuadView> {
  private revealing: boolean = false;
  private covering: boolean = false;

  private shuffle(arr: any[]): any[] {
    for (let i = arr.length - 1; i > 0; i--) {
      let j: number = Math.floor(Math.random() * (i + 1));
      let tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }

    return arr;
  }

  private generateMatrix(): Item[][] {
    let colors: Color[] = [Color.RED, Color.parse("#9900FF"), Color.BLUE];
    let values: number[] = [];
    for (let i = 1; i <= 5; i++) {
      values.push(i);
    }
    this.shuffle(colors);
    this.shuffle(values);

    let items: Item[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        let item = new Item(values[j], colors[i]);
        items.push(item, item);
      }
    }
    this.shuffle(items);
    let res: Item[][] = [];

    let idx = 0;
    for (let i = 0; i < 6; i++) {
      let tmp: Item[] = [];
      for (let j = 0; j < 5 && idx < 30; j++) {
        tmp.push(items[idx++]);
      }
      res.push(tmp);
    }
    return res;
  }

  private generateReveal(v: boolean): boolean[][] {
    let res: boolean[][] = [];
    for (let i = 0; i < 6; i++) {
      let row: boolean[] = [];
      for (let j = 0; j < 5; j++) {
        row.push(v);
      }
      res.push(row);
    }
    return res;
  }

  private checkWon(s: DuadModel, context: BridgeContext) {
    let won: boolean = true;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        if (!s.reveal![i][j]) {
          won = false;
          break;
        }
      }
    }
    if (won) {
      modal(context).toast("Bingo!", Gravity.Center);
    }
  }

  onAttached(state: DuadModel, vh: DuadView): void {
    state.matrix = this.generateMatrix();
    state.reveal = this.generateReveal(false);

    vh.cellClick = (i, j) => {
      if (this.revealing || this.covering) {
        return;
      }

      state.reveal![i][j] = true;

      let revealTop = vh.cellMatrix[i][j].top!;

      this.revealing = true;
      vh.revealAnim(revealTop).then(() => {
        this.revealing = false;
      });

      setTimeout(() => {
        if (state.firstSelect.length < 2) {
          state.firstSelect = [i, j];
        } else {
          let firTop =
            vh.cellMatrix[state.firstSelect[0]][state.firstSelect[1]].top!;

          let fir = state.matrix![state.firstSelect[0]][state.firstSelect[1]];
          let sec = state.matrix![i][j];
          if (fir.value != sec.value || fir.color != sec.color) {
            state.reveal![state.firstSelect[0]][state.firstSelect[1]] = false;
            state.reveal![i][j] = false;
            this.covering = true;
            vh.coverAnim([firTop, revealTop]).then(() => {
              this.covering = false;
            });
          } else {
            this.checkWon(state, this.context);
          }
          state.firstSelect = [];
        }
      }, 500);
    };
  }

  onBind(state: DuadModel, vh: DuadView): void {
    vh.bind(state);
  }
}

@Entry
export class DuadPanel extends VMPanel<DuadModel, DuadView> {
  getViewHolderClass() {
    return DuadView;
  }

  getViewModelClass() {
    return DuadVM;
  }

  getState() {
    return new DuadModel();
  }
}
