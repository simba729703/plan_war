import { _decorator, Component, Node , director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartUI')
export class StartUI extends Component {
    start() {

    }

	public update(deltaTime: number) {
        
    }

	public onStartButtonClick(){
        director.loadScene("02-GameScene")

	}
}

