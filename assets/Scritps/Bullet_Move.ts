import { _decorator, Component, Animation, Collider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet_Move')
export class Bullet_Move extends Component {
    @property
    speed: number = 500;

    @property(Animation)
    anim: Animation = null;

    private _dead = false;

    update(deltaTime: number) {
        if (this._dead) return;                
        const position = this.node.position;
        this.node.setPosition(position.x, position.y + this.speed * deltaTime, position.z);
        if (position.y > 650) this.node.destroy();
    }

   
    boom(): boolean {
        if (this._dead) return false;
        this._dead = true;

        const clip = this.anim && this.anim.clips[0];
        if (clip) this.anim.play(clip.name);

        this.scheduleOnce(() => {
            const c = this.getComponent(Collider2D);
            if (c) c.enabled = false;
        }, 0);

        this.scheduleOnce(() => {
            if (this.node.isValid) this.node.destroy();
        }, 0.3);

        return true;
    }
}
