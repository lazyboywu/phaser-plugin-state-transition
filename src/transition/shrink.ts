/// <reference path='../definitions.d.ts'/>

import View from '../view';
import Base from './base';

export default class Shrink extends Base {
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
        this.direction = this.get(data, 'direction', Shrink.DIRECTION.TOP_BOTTOM);
    }

    run() {
        this.game.world.add(this.inView);
        this.game.world.add(this.outView);

        this.outView.mask = this.createMask();

        this.tween = this.createTween();
        this.tween.onComplete.addOnce(this.complete, this);;
    }

    createMask() {
        var w = this.game.width;
        var h = this.game.height;

        var mask: any = this.game.add.graphics(0, 0);
        mask.beginFill(0xFFFFFF);
        mask.anchor.setTo(0.5, 0.5);
        mask.x = this.game.width / 2;
        mask.y = this.game.height / 2;
        mask.drawRect(-mask.x, -mask.y, this.game.width, this.game.height);
        return mask;
    }

    createTween() {
        var tween;
        if (this.direction == Shrink.DIRECTION.TOP_BOTTOM) {
            tween = this.game.add.tween(this.outView.mask.scale);
            tween.to(
                { y: 0 },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        } else if (this.direction == Shrink.DIRECTION.LEFT_RIGHT) {
            tween = this.game.add.tween(this.outView.mask.scale);
            tween.to(
                { x: 0 },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        }
        return tween;
    }

    complete() {
        this.outView.mask.destroy();

        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);

        super.complete();
    }
}
