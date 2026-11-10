import { director, _decorator, Component, Node } from 'cc';
import { Player } from './Player';
import { GameOverUI } from './UI/GameOverUI';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property
    private boomNumber: number = 0;

    @property
    private score: number = 0;
    private static readonly MAX_SCORE = 999999;

    @property(Node)
    player: Node = null;

    @property(Node)
    pauseButtonNode: Node = null;
    @property(Node)
    resumeButtonNode: Node = null;

    @property(GameOverUI)
    gameOverUI: GameOverUI = null;

    private static _instance: GameManager;

    public static getinstance(): GameManager {
        if (!GameManager._instance || !GameManager._instance.isValid) {
            GameManager._instance =
                director.getScene()?.getComponentInChildren(GameManager) ?? null!;
        }
        return GameManager._instance;
    }

    protected onDestroy(): void {
        if (GameManager._instance === this) GameManager._instance = null!;
    }

    protected onLoad(): void {
        GameManager._instance = this;
    }

    update(deltaTime: number) {

    }

    public AddBoom() {
        this.boomNumber++;
        this.node.emit("onBoomChange");
    }

    public GetBoomNumber(): number {
        return this.boomNumber;
    }

    public addScore(value: number) {
        this.score = Math.max(0, Math.min(this.score + value, GameManager.MAX_SCORE));
        this.node.emit('onScoreChange', this.score);
    }

    public getScore(): number {
        return this.score;
    }

    public resetScore() {
        this.score = 0;
        this.node.emit('onScoreChange', 0);
    }

    onPauseButtonClick() {
        director.pause();
        this.player?.getComponent(Player)?.disableControl();
        this.pauseButtonNode.active = false;
        this.resumeButtonNode.active = true;
    }

    onResumeButtonClick() {
        director.resume();
        this.player?.getComponent(Player)?.enableControl();
        this.pauseButtonNode.active = true;
        this.resumeButtonNode.active = false;
    }

    gameOver() {
        this.onPauseButtonClick();
        //显示gameover ui 更新分数

        let hScore = localStorage.getItem("HighestScore");
        let hScoreInt = 0;

        if (hScore !== null) {
            hScoreInt = parseInt(hScore, 10);
        }

        // if (this.score > hScoreInt) {
        //     localStorage.setItem("HighestScore", this.score.toString());
        // }


        if (this.score > hScoreInt) {
            hScoreInt = this.score;
            localStorage.setItem('HighestScore', hScoreInt.toString());
        }
        this.gameOverUI.showGameOverUI(hScoreInt, this.score);

    }

    onRestartButtonClick() {
        director.resume();                       
        director.loadScene('02-GameScene');      
    }


    onQuitButtonClick() {

    }


    public UseBoom(): boolean {
        if (this.boomNumber <= 0) return false;
        this.boomNumber--;
        this.node.emit('onBoomChange');
        return true;
    }


}


