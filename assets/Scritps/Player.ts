import { Tween, Sprite, Animation, _decorator, Component, Vec3, input, Input, IPhysics2DContact, EventTouch, Prefab, instantiate, Node, Collider2D, Contact2DType, director, tween } from 'cc';
import { Reword, RewordType } from './Reword';
import { Enemy } from './Enemy';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    //炮弹发射
    @property
    shootRate: number = 0.2;
    shootTimer: number = 0;

    @property(Node)
    bulletParent: Node = null;
    @property(Node)
    bulletPosition: Node = null;
    @property(Prefab)
    bulletPrefab: Prefab = null;

    @property
    hp: number = 3;
    @property
    maxHp: number = 3;


    @property
    invincibleTime: number = 1;
    @property
    shieldTime: number = 3;
    isInvincible: boolean = false;
    incincibleTimer: number = 0;
    private invincibleDuration: number = 0;   // 无敌持续多久

    //暂停
    private canControl: boolean = true;

    @property(Animation)
    anim: Animation = null;
    @property
    animHit: string = "";
    @property
    animDown: string = "";

    @property(Node)
    shieldNode: Node = null;


    collider: Collider2D = null;

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        //注册单个碰撞体的回调函数
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    setHp(v: number) {
        const old = this.hp;
        this.hp = Math.max(0, Math.min(v, this.maxHp));
        if (this.hp !== old) {
            this.node.emit('onHpChange', this.hp);
        }
    }

    onTouchMove(event: EventTouch) {
        if (this.hp <= 0) return; // 玩家已死亡

        if (!this.canControl) return; // 暂停时

        const p = this.node.position;

        let targetPosition = new Vec3(p.x + event.getDeltaX(), p.y + event.getDeltaY(), p.z);

        if (targetPosition.x < -360) {
            targetPosition.x = -360;
        }
        if (targetPosition.x > 360) {
            targetPosition.x = 360;
        }

        if (targetPosition.y < -612) {
            targetPosition.y = -612;
        }
        if (targetPosition.y > 600) {
            targetPosition.y = 600;
        }

        this.node.setPosition(targetPosition);
    }

    protected update(dt: number): void {
        this.shootTimer += dt;
        if (this.shootTimer >= this.shootRate) {
            this.shootTimer = 0;
            const bullet = instantiate(this.bulletPrefab);
            this.bulletParent.addChild(bullet);
            bullet.setWorldPosition(this.bulletPosition.worldPosition);
        }


        if (this.isInvincible) {
            this.incincibleTimer += dt;
            if (this.incincibleTimer >= this.invincibleDuration) this.isInvincible = false;
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.hp <= 0) return;

        const reward = otherCollider.getComponent(Reword);
        if (reward) {
            this.onContactWithReward(reward);
        } else {
            this.onContactWithEnemy();
        }

    }

    translationToCure() {
        console.log('Cure');
        this.setHp(this.hp + 1);
    }


    translationToShield() {
        console.log('Shield');
        this.startInvincible(this.shieldTime);
        this.showShield(this.shieldTime);
    }

    private showShield(duration: number) {
        if (!this.shieldNode) return;
        this.shieldNode.active = true;
        this.shieldNode.setScale(1.12, 1.12, 1);
        Tween.stopAllByTarget(this.shieldNode);
        tween(this.shieldNode)
            .to(0.18, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .start();
        this.unschedule(this.hideShield);
        this.scheduleOnce(this.hideShield, duration);
    }

    private hideShield = () => {
        if (!this.shieldNode || !this.shieldNode.isValid) return;
        Tween.stopAllByTarget(this.shieldNode);
        this.shieldNode.active = false;
    };


    translationToBoom() {

        console.log('Boom');
        const scene = director.getScene();
        if (!scene) return;

        // 用字符串查组件：运行时不需要 Enemy 类对象，绕开循环依赖
        const enemies = scene.getComponentsInChildren('Enemy') as unknown as Enemy[];
        for (const e of enemies) {
            if (e.hp > 0) e.onBoomKill();
        }
    }

    startInvincible(duration: number) {
        this.isInvincible = true;
        this.incincibleTimer = 0;
        this.invincibleDuration = duration;
    }

    onContactWithEnemy() {
        if (this.isInvincible) return;
        this.startInvincible(this.invincibleTime);

        this.setHp(this.hp - 1);
        if (this.hp > 0) {
            this.anim.play(this.animHit);
        } else {
            this.anim.play(this.animDown);
        }

        if (this.hp <= 0) {
            this.hideShield();   
            this.scheduleOnce(() => {
                if (this.collider) this.collider.enabled = false;
                this.enabled = false;
                GameManager.getinstance()?.gameOver();
            }, 0.6);
        }
    }

    lastReward: Reword = null;

    onContactWithReward(reward: Reword) {
        if (reward == this.lastReward) return;
        this.lastReward = reward;

        switch (reward.rewordType) {
            case RewordType.Cure:
                this.translationToCure();
                break;
            case RewordType.Shield:
                this.translationToShield();
                break;
            case RewordType.Boom:
                GameManager.getinstance().AddBoom();
                //this.translationToBoom();
                break;
        }
        reward.getComponent(Collider2D).enabled = false;
        reward.getComponent(Sprite).enabled = false;
    }

    disableControl() {
        this.canControl = false;
    }
    enableControl() {
        this.canControl = true;
    }

}
