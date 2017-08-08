/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Wipe extends Base {
    static DIRECTION = {
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
        TOP: 'TOP',
        BOTTOM: 'BOTTOM',
        LEFT_TOP: 'LEFT_TOP',
        RIGHT_TOP: 'RIGHT_TOP',
        LEFT_BOTTOM: 'LEFT_BOTTOM',
        RIGHT_BOTTOM: 'RIGHT_BOTTOM',
    }

    direction: string;
    tween: Phaser.Tween;

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);
        this.direction = _.get(data, 'direction', Wipe.DIRECTION.LEFT);
    }

    run() {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);

        var tween = this.game.add.tween(this.outView);
        var mask = this.createMask();

        this.inView.mask = mask;

        tween = this.game.add.tween(this.inView.mask.scale);
        if (this.direction == Wipe.DIRECTION.TOP || this.direction == Wipe.DIRECTION.BOTTOM) {
            tween.from(
                { y: 0 },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        } else if (this.direction == Wipe.DIRECTION.LEFT || this.direction == Wipe.DIRECTION.RIGHT) {
            tween.from(
                { x: 0 },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        } else{
            tween.from(
                { x: 0, y:0 },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        }

        tween.onComplete.addOnce(this.complete, this);

        this.tween = tween;
    }

    createMask() {
        var mask;

        if (this.direction == Wipe.DIRECTION.TOP) {
            mask = this.game.add.graphics(0, this.game.height);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, -this.game.height, this.game.width, this.game.height);
        } else if (this.direction == Wipe.DIRECTION.BOTTOM) {
            mask = this.game.add.graphics(0, 0);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, 0, this.game.width, this.game.height);
        } else if (this.direction == Wipe.DIRECTION.LEFT) {
            mask = this.game.add.graphics(this.game.width, 0);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(-this.game.width, 0, this.game.width, this.game.height);
        } else if (this.direction == Wipe.DIRECTION.RIGHT) {
            mask = this.game.add.graphics(0, 0);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, 0, this.game.width, this.game.height);
        } else if (this.direction == Wipe.DIRECTION.LEFT_TOP) {
            mask = this.game.add.graphics(this.game.width, this.game.height);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(-this.game.width, -this.game.height, this.game.width, this.game.height);
        } else if (this.direction == Wipe.DIRECTION.LEFT_BOTTOM) {
            mask = this.game.add.graphics(this.game.width, 0);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(-this.game.width, 0, this.game.width, this.game.height);
        } else if (this.direction == Wipe.DIRECTION.RIGHT_TOP) {
            mask = this.game.add.graphics(0, this.game.height);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, -this.game.height, this.game.width, this.game.height);
        } else if (this.direction == Wipe.DIRECTION.RIGHT_BOTTOM) {
            mask = this.game.add.graphics(0, 0);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, 0, this.game.width, this.game.height);
        } 

        return mask;
    }

    complete() {
        this.inView.mask.destroy();
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        super.complete();
    }
}
