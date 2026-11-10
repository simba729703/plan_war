import { _decorator, Component, Node, Prefab, instantiate, math, Input, input,director } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {
    @property
    enemy0SpawnRate: number = 7;
    @property(Prefab)
    enemy0Prefab: Prefab = null;

    @property
    enemy1SpawnRate: number = 3;
    @property(Prefab)
    enemy1Prefab: Prefab = null;

    @property
    enemy2SpawnRate: number = 1;
    @property(Prefab)
    enemy2Prefab: Prefab = null;

    @property
    tankSpawnRate: number = 15;
    @property(Prefab)
    tankPrefab: Prefab = null;

    @property
    rewordSpawnRate: number = 18;
    @property(Prefab)
    reword0Prefab: Prefab = null;
    @property(Prefab)
    reword1Prefab: Prefab = null;
    @property(Prefab)
    reword2Prefab: Prefab = null;

    doubleClickInterval: number = 0.2;
    lastClickTime: number = 0;

    protected onLoad(): void {
        this.lastClickTime = 0;
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }


    start() {
        this.schedule(this.enemy0Spawn, this.enemy0SpawnRate);
        this.schedule(this.enemy1Spawn, this.enemy1SpawnRate);
        this.schedule(this.enemy2Spawn, this.enemy2SpawnRate);
        this.schedule(this.tankSpawn, this.tankSpawnRate);
        this.schedule(this.rewordSpawn, this.rewordSpawnRate);
    }

    update(deltaTime: number) {

    }

    protected onDestroy(): void {
        this.unschedule(this.enemy0Spawn);
        this.unschedule(this.enemy1Spawn);
        this.unschedule(this.enemy2Spawn);
        this.unschedule(this.tankSpawn);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    enemy0Spawn() {
        this.enemySpawn(this.enemy0Prefab, -305, 305, 690);
    }
    enemy1Spawn() {
        this.enemySpawn(this.enemy1Prefab, -318, 318, 680);
    }
    enemy2Spawn() {
        this.enemySpawn(this.enemy2Prefab, -325, 325, 670);
    }
    tankSpawn() {
        this.enemySpawn(this.tankPrefab, -320, 320, 680);
    }
    rewordSpawn() {
        const random = math.randomRangeInt(0, 3);
        let prefab = null;
        if (random == 0) prefab = this.reword0Prefab;
        else if (random == 1) prefab = this.reword1Prefab;
        else prefab = this.reword2Prefab;
        this.enemySpawn(prefab, -330, 330, 680);
    }

    enemySpawn(enemyPrefab: Prefab, minX: number, maxX: number, Y: number) {
        const enemy = instantiate(enemyPrefab);
        this.node.addChild(enemy);
        const randomX = math.randomRangeInt(minX, maxX);
        enemy.setPosition(randomX, Y, 0);
    }

    onTouchEnd(event) {
        let currentTime = Date.now();
        let timeDiff = (currentTime - this.lastClickTime) / 1000; // 转换为秒

        if (timeDiff < this.doubleClickInterval) {
            console.log("Detected a double click!");
            this.onDoubleClick(event);
        }

        this.lastClickTime = currentTime;
    }

    onDoubleClick(event) {
        // 双击后执行的操作
        console.log("Double click action executed.");
        if (director.isPaused()) return;                 // 暂停或结算面板里双击无效

        const gm = GameManager.getinstance();
        if (!gm) return;

        const player = gm.player?.getComponent('Player') as any;
        if (!player || player.hp <= 0) return;           // 玩家已死

        if (!gm.UseBoom()) {                             // 扣数量，没库存直接返回
            console.log('炸弹用完了');
            return;
        }

        // 清屏：遍历场景里所有敌机
        const enemies = this.node.scene!.getComponentsInChildren('Enemy') as any[];
        for (const e of enemies) {
            if (e.hp > 0) e.onBoomKill();
        }
    }




}


