import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


export enum RewordType {
    Cure,
    Shield,
    Boom
}

@ccclass('Reword')
export class Reword extends Component {
    @property
    speed: number = 100;

    @property
    rewordType: RewordType = RewordType.Cure;
    
    start() {

    }

    update(deltaTime: number) {
        const p = this.node.position;
        this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);

        if (this.node.position.y < -680) {     
            this.node.destroy();
        }
    }
}


