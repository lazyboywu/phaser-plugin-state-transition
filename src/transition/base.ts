/// <reference path='../definitions.d.ts'/>

import View from '../view';

export default class Base {

    game: Phaser.Game;
    outView: View;
    inView: View;
    onComplete = new Phaser.Signal();

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        this.game = game;
        this.outView = outView;
        this.inView = inView;
    }

    get<result>(data: {[key:string]: any}, key: string, def: result): result {
        let result: result;
        if (data != null && Object.prototype.hasOwnProperty.call(data, key)) {
            result = data[key];
        } else {
            result = def;
        }
        return result;
    }

    run() {
        // nothing
    }

    complete() {
        if (this.outView) {
            this.inView.destroy();
        }
        if (this.outView) {
            this.inView.destroy();
        }
        this.onComplete.dispatch();
        this.game = null;
    }
}
