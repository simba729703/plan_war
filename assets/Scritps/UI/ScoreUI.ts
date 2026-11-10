import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { GameManager } from '../GameManager';

const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {

    @property(Sprite) d0: Sprite = null;   // 个位
    @property(Sprite) d1: Sprite = null;   // 十位
    @property(Sprite) d2: Sprite = null;   // 百位
    @property(Sprite) d3: Sprite = null;   // 千位
    @property(Sprite) d4: Sprite = null;   // 万位
    @property(Sprite) d5: Sprite = null;   // 十万位
    @property([SpriteFrame]) frames: SpriteFrame[] = [];   // 0~9

    private digits: Sprite[] = [];

    start() {
        // 从低位到高位排列，循环时 i 就是 10 的幂次
        this.digits = [this.d0, this.d1, this.d2, this.d3, this.d4, this.d5];

        const gm = GameManager.getinstance();
        if (!gm) {
            console.warn('ScoreUI: GameManager 未挂载');
            return;
        }
        gm.node.on('onScoreChange', this.onScoreChange, this);
        this.onScoreChange(gm.getScore());   // 进场先刷一次，别等击杀才显示
    }

    onDestroy() {
        const target = GameManager.getinstance()?.node;
        if (target && target.isValid) {
            target.off('onScoreChange', this.onScoreChange, this);
        }
    }

    private onScoreChange(score: number) {
        let v = Math.floor(Math.max(0, score));
        for (let i = 0; i < this.digits.length; i++) {
            const s = this.digits[i];
            if (!s) continue;
            s.spriteFrame = this.frames[v % 10];
            v = Math.floor(v / 10);
        }
    }
}
