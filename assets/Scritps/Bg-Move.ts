import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bg-Move')
export class BgMove extends Component {
    
    @property(Node)
    Bg1: Node = null;
    @property(Node)
    Bg2: Node = null;

    @property
    speed:number = 100;
    
    start() {

    }

	update(deltaTime: number) {
        let position1 = this.Bg1.position;
        this.Bg1.setPosition(position1.x,position1.y - this.speed*deltaTime,position1.z);
    
        let position2 = this.Bg2.position;
        this.Bg2.setPosition(position2.x,position2.y - this.speed*deltaTime,position2.z);
   

        let p1 = this.Bg1.position;
        let p2 = this.Bg2.position;
        if(this.Bg1.position.y <= -2560) {
            this.Bg1.setPosition(p2.x,p2.y + 2560,p2.z);
        }
        if(this.Bg2.position.y <= -2560) {
            this.Bg2.setPosition(p1.x,p1.y + 2560,p1.z);
        }
    }
}


