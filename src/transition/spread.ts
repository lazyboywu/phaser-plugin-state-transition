/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Spread extends Base {
    static DIRECTION = {
        TOP_BOTTOM: 'TOP_BOTTOM',
        LEFT_RIGHT: 'LEFT_RIGHT',
        LEFT_TOP: "LEFT_TOP",
        LEFT_BOTTOM: "LEFT_BOTTOM",
        RIGHT_TOP: "RIGHT_TOP",
        RIGHT_BOTTOM: "RIGHT_BOTTOM",

    }

    direction: string;
    tween: Phaser.Tween;

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);
        this.direction = _.get(data, 'direction', Spread.DIRECTION.TOP_BOTTOM);
    }

    run() {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);

        this.inView.mask = this.createMask();

        this.tween = this.createTween();
        this.tween.onComplete.addOnce(this.complete, this);;
    }

    createMask() {
        var w = this.game.width;
        var h = this.game.height;
        var divideCount = 16;
        var divideX = w / divideCount;
        var divideY = h / divideCount;

        var mask: any = this.game.add.graphics(0, 0);
        mask.beginFill(0xFFFFFF);
        if (this.direction == Spread.DIRECTION.TOP_BOTTOM || this.direction == Spread.DIRECTION.LEFT_RIGHT) {
            mask.anchor.setTo(0.5, 0.5);
            mask.x = this.game.width / 2;
            mask.y = this.game.height / 2;
            mask.drawRect(-mask.x, -mask.y, this.game.width, this.game.height);
        } else if (this.direction == Spread.DIRECTION.LEFT_TOP) {
            for (var i = 0; i < divideCount; i++) {
                mask.drawRect(2 * w - divideX * i, divideY * i, this.game.width + divideX * i, divideY);
            }
        } else if (this.direction == Spread.DIRECTION.RIGHT_BOTTOM) {
            for (var i = 0; i < divideCount; i++) {
                mask.drawRect(-2 * w, divideY * i, this.game.width + divideX * (divideCount - i), divideY);
            }
        } else if (this.direction == Spread.DIRECTION.RIGHT_TOP) {
            for (var i = 0; i < divideCount; i++) {
                mask.drawRect(-2 * w, divideY * i, this.game.width + divideX * i, divideY);
            }
        } else if (this.direction == Spread.DIRECTION.LEFT_BOTTOM) {
            for (var i = 0; i < divideCount; i++) {
                mask.drawRect(w + divideX * i, divideY * i, 2 * this.game.width - divideX * i, divideY);
            }
        }

        return mask;
    }

    createTween() {
        var tween;
        if (this.direction == Spread.DIRECTION.TOP_BOTTOM) {
            tween = this.game.add.tween(this.inView.mask.scale);
            tween.from(
                { y: 0 },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        } else if (this.direction == Spread.DIRECTION.LEFT_RIGHT) {
            tween = this.game.add.tween(this.inView.mask.scale);
            tween.from(
                { x: 0 },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        } else if (this.direction == Spread.DIRECTION.LEFT_TOP || this.direction == Spread.DIRECTION.LEFT_BOTTOM) {
            tween = this.game.add.tween(this.inView.mask);
            tween.to(
                { x: -2 * this.game.width },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        } else if (this.direction == Spread.DIRECTION.RIGHT_BOTTOM || this.direction == Spread.DIRECTION.RIGHT_TOP) {
            tween = this.game.add.tween(this.inView.mask);
            tween.to(
                { x: 2 * this.game.width },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        }


        return tween;
    }

    complete() {
        this.inView.mask.destroy();

        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);

        super.complete();
    }
}
