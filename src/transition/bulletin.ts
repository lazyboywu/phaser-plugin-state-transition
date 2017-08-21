/// <reference path='../definitions.d.ts'/>

import View from '../view';
import Base from './base';

export default class Bulletin extends Base {

    tweenRotate: Phaser.Tween;
    tweenScale: Phaser.Tween;

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);
    }

    run() {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);


        this.inView.anchor.setTo(0.5, 0.5);
        this.inView.top = 0;
        this.inView.left = 0;

        var tweenRotate = this.game.add.tween(this.inView);
        tweenRotate.from(
            { angle: 180 },
            1000,
            Phaser.Easing.Linear.None,
            true
        );

        var tweenScale = this.game.add.tween(this.inView.scale);
        tweenScale.from(
            { x: 0, y: 0 },
            1000,
            Phaser.Easing.Linear.None,
            true
        );

        tweenRotate.onComplete.addOnce(this.complete, this);

        this.tweenRotate = tweenRotate;
        this.tweenScale = tweenScale;
    }

    complete() {
        this.game.tweens.remove(this.tweenRotate);
        this.game.tweens.remove(this.tweenScale);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);

        super.complete();
    }
}
