/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Fade extends Base {
    static TIPE = {
        BLACK: 'BLACK',
        SMOOTHLY: 'SMOOTHLY',
    }

    tipe: string;
    tweenOut: Phaser.Tween;
    tweenIn: Phaser.Tween;
    blackRectangle: Phaser.Graphics;

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);
        this.tipe = _.get(data, 'tipe', Fade.TIPE.BLACK);
    }

    run() {
        //this.game.world.add(this.outView);
        this.game.world.add(this.inView);

        if (this.tipe == Fade.TIPE.BLACK) {
            var blackRectangle = this.game.add.graphics(0, 0);
            blackRectangle.beginFill(0x000000);
            blackRectangle.drawRect(0, 0, this.game.width, this.game.height);

            this.game.world.add(blackRectangle);

            this.game.world.add(this.outView);

            var tweenOut = this.game.add.tween(this.outView);
            tweenOut.to(
                { alpha: 0 },
                500,
                Phaser.Easing.Linear.None,
                false
            );

            var tweenIn = this.game.add.tween(blackRectangle);
            tweenIn.to(
                { alpha: 0 },
                500,
                Phaser.Easing.Linear.None,
                false
            );
            tweenOut.chain(tweenIn);
            tweenOut.start();

            tweenIn.onComplete.addOnce(this.complete, this);
            this.tweenIn = tweenIn;
            this.tweenOut = tweenOut;
            this.blackRectangle = blackRectangle;
        } else {
            this.game.world.add(this.outView);

            var tweenOut = this.game.add.tween(this.outView);
            tweenOut.to(
                { alpha: 0 },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
            tweenOut.onComplete.addOnce(this.complete, this);
            this.tweenOut = tweenOut;
        }
    }

    complete() {
        if (this.tweenOut) {
            this.game.tweens.remove(this.tweenOut);
        }
        if (this.tweenIn) {
            this.game.tweens.remove(this.tweenIn);
        }
        if(this.blackRectangle){
            this.blackRectangle.destroy();
        }

        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        super.complete();
    }
}
