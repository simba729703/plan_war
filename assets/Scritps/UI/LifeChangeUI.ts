import { _decorator, Component, Sprite, SpriteFrame, director } from 'cc';
import { Player } from '../Player';

const { ccclass, property } = _decorator;

@ccclass('LifeChangeUI')
export class LifeChangeUI extends Component {

    @property(Sprite) digit1: Sprite = null;   // 十位
    @property(Sprite) digit0: Sprite = null;   // 个位
    @property([SpriteFrame]) frames: SpriteFrame[] = [];

    private player: Player = null;

    start() {
        const scene = director.getScene();
        this.player = scene ? scene.getComponentInChildren(Player) : null;
        if (!this.player) {
            console.warn('LifeUI: 场景里找不到 Player');
            return;
        }
        this.player.node.on('onHpChange', this.onHpChange, this);
        this.onHpChange(this.player.hp);
    }

    // start() {
    //     const gm = GameManager.getinstance();
    //     if (!gm) return;
    //     gm.node.on('onBoomChange', this.onBoomChange, this);
    //     this.onBoomChange();
    // }


    onDestroy() {
        const target = this.player?.node;
        if (target && target.isValid) {
            target.off('onHpChange', this.onHpChange, this);
        }
    }


    onHpChange(hp: number) {
        const v = Math.max(0, hp);
        const isTwo = v >= 10;

        this.digit1.node.active = isTwo;
        this.digit0.spriteFrame = this.frames[v % 10];
        this.digit0.node.setPosition(isTwo ? 16 : 0, 0, 0);
        if (isTwo) this.digit1.spriteFrame = this.frames[Math.floor(v / 10) % 10];
    }
}
