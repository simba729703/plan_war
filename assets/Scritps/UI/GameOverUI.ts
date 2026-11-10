// import { _decorator, Component, Label, Node ,SpriteFrame ,Sprite} from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('GameOverUI')
// export class GameOverUI extends Component {
//     @property(Node)
//     highestScoreLabel: Node = null!;
//     @property(Node)
//     currentScoreLabel: Node = null!;

//     showGameOverUI(highestScore: number, currentScore: number) {
//         this.node.active = true;
//         this.highestScoreLabel.getComponent(Label)!.string = highestScore.toString();
//         this.currentScoreLabel.getComponent(Label)!.string = currentScore.toString();
//     }
// }


// @ccclass('GameOverUI')
// export class GameOverUI extends Component {
//     @property({ type: [SpriteFrame] }) digits: SpriteFrame[] = [];
//     @property({ type: [Sprite] }) bestSlots: Sprite[] = [];   // 索引 0 = 个位
//     @property({ type: [Sprite] }) scoreSlots: Sprite[] = [];

//     showGameOverUI(best: number, cur: number) {
//         this.node.active = true;
//         this.fill(this.bestSlots, best);
//         this.fill(this.scoreSlots, cur);
//     }

//     private fill(slots: Sprite[], value: number) {
//         let v = Math.max(0, Math.floor(value || 0));
//         for (let i = 0; i < slots.length; i++) {
//             slots[i].spriteFrame = this.digits[v % 10];
//             v = Math.floor(v / 10);
//         }
//     }
// }


import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
    @property({ type: [SpriteFrame] }) digits: SpriteFrame[] = [];

    showGameOverUI(best: number, cur: number) {
        this.node.active = true;
        this.fill(this.collect('BestRow'), best);
        this.fill(this.collect('ScoreRow'), cur);
    }

    /** 从 Row 节点下按 d0~d5 的名字收集 Sprite，索引 0 = 个位 */
    private collect(rowName: string): Sprite[] {
        const row = this.node.getChildByName(rowName);
        if (!row) { console.warn('找不到节点', rowName); return []; }
        return row.children
            .filter(c => /^d\d$/.test(c.name))
            .sort((a, b) => Number(a.name.slice(1)) - Number(b.name.slice(1)))
            .map(c => c.getComponent(Sprite))
            .filter(Boolean) as Sprite[];
    }

    private fill(slots: Sprite[], value: number) {
    // 同一父节点下 x 从大到小 = 从右到左，最右那个就是槽位
    const ordered = slots.slice().sort((a, b) => b.node.position.x - a.node.position.x);

    let v = Math.max(0, Math.floor(value || 0));
    for (let i = 0; i < ordered.length; i++) {
        ordered[i].spriteFrame = this.digits[v % 10];
        v = Math.floor(v / 10);
    }
}

}

