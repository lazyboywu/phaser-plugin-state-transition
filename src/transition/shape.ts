/// <reference path='../definitions.d.ts'/>

import View from '../view';
import Base from './base';

export default class Shape extends Base {
    static SHAPE = {
        CIRCLE: 'CIRCLE',
        DIAMOND: 'DIAMOND',
    }

    shape: string;
    tween: Phaser.Tween;

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);
        this.shape = this.get(data, 'shape', Shape.SHAPE.CIRCLE);
    }

    run() {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);

        var mask = this.game.add.graphics(this.game.width / 2, this.game.height / 2);
        mask.beginFill(0xFFFFFF);

        this.inView.mask = mask;

        if (this.shape == Shape.SHAPE.CIRCLE) {
            mask.drawCircle(0, 0, Math.sqrt(this.game.width * this.game.width + this.game.height * this.game.height));
        } else if (this.shape == Shape.SHAPE.DIAMOND) {
            mask.drawPolygon(
                { x: -this.game.width * 2, y: 0 },
                { x: 0, y: this.game.height * 2 },
                { x: this.game.width * 2, y: 0 },
                { x: 0, y: -this.game.height * 2 }
            );
        }
        var tween = this.game.add.tween(this.inView.mask.scale);


        tween.from(
            { x: 0, y: 0 },
            1000,
            Phaser.Easing.Linear.None,
            true
        );
        tween.onComplete.addOnce(this.complete, this);

        this.tween = tween;
    }

    complete() {
        this.inView.mask.destroy();
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        super.complete();
    }
}
