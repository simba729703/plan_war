import { _decorator, Collider2D, Component, Contact2DType, Node, Animation, IPhysics2DContact } from 'cc';
import { Bullet_Move } from './Bullet_Move';
import { Player } from './Player';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    speed: number = 300;

    @property(Animation)
    anim: Animation = null;

    @property
    hp: number = 1;

    @property
    score: number = 10;

    collider: Collider2D = null;

    start() {
        //this.ainm.play();
        //注册单个碰撞体的回调函数
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update(deltaTime: number) {
        if (this.hp > 0) {
            const p = this.node.position;
            this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);
        }

        if (this.node.position.y < -680) {
            this.node.destroy();
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (this.hp <= 0) return;

        const bullet = otherCollider.getComponent(Bullet_Move);
        if (bullet) {
            if (!bullet.boom()) return;   // 同一颗子弹只结算一次
            this.hp -= 1;
        } else if (otherCollider.getComponent(Player)) {
            this.hp -= 1;                  // 撞机：敌机hp-1，玩家hp-1
        } else {
            return;                       // 敌机互撞，忽略
        }

        if (this.hp <= 0) {
            GameManager.getinstance().addScore(this.score);
            this.die();
        }
    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }


    onBoomKill() {
        if (this.hp <= 0) return;
        this.hp = 0;
        GameManager.getinstance()?.addScore(this.score);   // 炸弹击杀也计分
        this.die();
    }


    private die() {
        const clip = this.anim && this.anim.clips[0];
        if (clip) this.anim.play(clip.name);

        this.scheduleOnce(() => {
            if (this.collider) this.collider.enabled = false;
            this.node.destroy();
        }, 1);
    }



}
