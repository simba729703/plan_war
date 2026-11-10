import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { GameManager } from '../GameManager';

const { ccclass, property } = _decorator;

@ccclass('BoomChangeUI')
export class BoomChangeUI extends Component {

    @property(Sprite) digit1: Sprite = null;    // 十位
    @property(Sprite) digit0: Sprite = null;    // 个位
    @property([SpriteFrame]) frames: SpriteFrame[] = [];

    start() {
        GameManager.getinstance().node.on('onBoomChange', this.onBoomChange, this);
        this.onBoomChange();
    }

    onBoomChange() {
        const n = GameManager.getinstance().GetBoomNumber();
        const isTwo = n >= 10;

        this.digit1.node.active = isTwo;
        this.digit0.spriteFrame = this.frames[n % 10];
        this.digit0.node.setPosition(isTwo ? 16 : 0, 0, 0);

        if (isTwo) this.digit1.spriteFrame = this.frames[Math.floor(n / 10) % 10];
    }

    onDestroy() {
        const target = GameManager.getinstance()?.node;
        if (target && target.isValid) {
            target.off('onBoomChange', this.onBoomChange, this);
        }
    }

}
