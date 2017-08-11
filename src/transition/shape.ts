/// <reference path='../definitions.d.ts'/>

import View from '../view';
import Base from './base';

export default class Shape extends Base {
    static SHAPE = {
        CIRCLE: 'CIRCLE',
        DIAMOND: 'DIAMOND',
        PLUS: 'PLUS',
    }

    shape: string;
    tween: Phaser.Tween;

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);
        this.shape = this.get(data, 'shape', Shape.SHAPE.CIRCLE);
    }

    run() {
        var w = this.game.width;
        var h = this.game.height;
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);

        var mask: any = this.game.add.graphics(0, 0);
        mask.beginFill(0xFFFFFF);
        mask.anchor.setTo(0.5, 0.5);
        mask.x = w / 2;
        mask.y = h / 2;

        this.inView.mask = mask;

        if (this.shape == Shape.SHAPE.CIRCLE) {
            mask.drawCircle(0, 0, Math.sqrt(w * w + h * h));
        } else if (this.shape == Shape.SHAPE.DIAMOND) {
            mask.drawPolygon(
                { x: -w * 2, y: 0 },
                { x: 0, y: h * 2 },
                { x: w * 2, y: 0 },
                { x: 0, y: -h * 2 }
            );
        } else if (this.shape == Shape.SHAPE.PLUS) {
            mask.drawRect(-w / 2, -3 * h / 2, w, 3 * h);
            mask.drawRect(-3 * w / 2, - h / 2, 3 * w, h);
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
