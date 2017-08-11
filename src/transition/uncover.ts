/// <reference path='../definitions.d.ts'/>

import View from '../view';
import Base from './base';

export default class Uncover extends Base {
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
        this.direction = this.get(data, 'direction', Uncover.DIRECTION.LEFT);
    }

    run() {
        this.game.world.add(this.inView);
        this.game.world.add(this.outView);

        var tween = this.game.add.tween(this.outView);
        var position = this.calculatePosition();
        tween.to(
            position,
            1000,
            Phaser.Easing.Linear.None,
            true
        );
        tween.onComplete.addOnce(this.complete, this);

        this.tween = tween;
    }

    calculatePosition() {
        var position = {
            x: this.outView.x,
            y: this.outView.y,
        };

        if (this.direction == Uncover.DIRECTION.LEFT) {
            position.x = -this.game.width;
        } else if (this.direction == Uncover.DIRECTION.LEFT_BOTTOM) {
            position.x = -this.game.width;
            position.y = this.game.height;
        } else if (this.direction == Uncover.DIRECTION.BOTTOM) {
            position.y = this.game.height;
        } else if (this.direction == Uncover.DIRECTION.RIGHT_BOTTOM) {
            position.x = this.game.width;
            position.y = this.game.height;
        } else if (this.direction == Uncover.DIRECTION.RIGHT) {
            position.x = this.game.width;
        } else if (this.direction == Uncover.DIRECTION.RIGHT_TOP) {
            position.x = this.game.width;
            position.y = -this.game.height;
        } else if (this.direction == Uncover.DIRECTION.TOP) {
            position.y = -this.game.height;
        } else if (this.direction == Uncover.DIRECTION.LEFT_TOP) {
            position.x = -this.game.width;
            position.y = -this.game.height;
        }

        return position;
    }

    complete() {
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.inView);
        this.game.world.remove(this.outView);
        super.complete();
    }
}
