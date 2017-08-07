/// <reference path='./definitions.d.ts'/>

import View from './view';
import Transition from './transition';

class Manager {
    game: Phaser.Game;

    constructor(game: Phaser.Game) {
        this.game = game;

        // 添加 game 属性 stateTransition
        Object.defineProperty(game, 'stateTransition', {
            value: this
        });
    }

    start(stateKey: string, transitionData: object, clearWorld: boolean, clearCache: boolean, ...args: any[]) {
        let outView = new View(this.game);

        let state = this.game.state.states[stateKey] as Phaser.State;
        let _this = this;
        (function(state, transitionData, outView) {
            let oldCreate = state.create;
            // 替换 create 方法
            state.create = function() {
                oldCreate.call(state);

                let inView = new View(this.game);
                let transition = Transition.factory.create(this.game, outView, inView, transitionData);

                if (!transition) {
                    return;
                }

                (state.game.state as any)._created = false;

                transition.onComplete.addOnce(function() {
                    (state.game.state as any)._created = true;

                    // 还原 create 方法
                    state.create = oldCreate;

                    // 增加一个执行回调函数
                    let postTransit = (state as any).postTransit;
                    if (postTransit && typeof postTransit === 'function') {
                        postTransit.call(state);
                    }

                    console.log('111')
                });

                transition.run();
            };

        })(state, transitionData, outView);

        this.game.state.start(stateKey, true, clearCache, ...args);
    }
}

let StateTransition = (window as any).StateTransition = {Manager, Transition, View};

export default StateTransition;
