/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Cover extends Base {
    static DIRECTION = {
        LEFT: "LEFT",
        RIGHT: "RIGHT"
    }

    direction: string;
    tween: Phaser.Tween;

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);
        this.direction = _.get(data, 'direction', Cover.DIRECTION.LEFT);
    }

    run() {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        var tween = this.game.add.tween(this.inView);
        if (this.direction == Cover.DIRECTION.LEFT) {
            tween.from(
                { x: this.game.width },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        } else {
            tween.from(
                { x: -this.game.width },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        }

        tween.onComplete.addOnce(this.complete, this);

        this.tween = tween;
    }

    complete() {
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        super.complete();
    }
}
