/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Push extends Base {
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
    tweenIn: Phaser.Tween;
    tweenOut: Phaser.Tween;

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);
        this.direction = _.get(data, 'direction', Push.DIRECTION.LEFT);
    }

    run() {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);

        var tweenIn = this.game.add.tween(this.inView);
        var tweenOut = this.game.add.tween(this.outView);
        var position = this.calculatePosition();
        tweenOut.to(
            position.outPosition,
            1000,
            Phaser.Easing.Linear.None,
            true
        );
        tweenIn.from(
            position.inPosition,
            1000,
            Phaser.Easing.Linear.None,
            true
        );
        tweenIn.onComplete.addOnce(this.complete, this);

        this.tweenIn = tweenIn;
        this.tweenOut = tweenOut;
    }

    calculatePosition() {
        var inPosition = {
            x: this.inView.x,
            y: this.inView.y,
        };

        var outPosition = {
            x: this.outView.x,
            y: this.outView.y,
        };

        var position = {
            inPosition: inPosition,
            outPosition: outPosition
        }

        if (this.direction == Push.DIRECTION.LEFT) {
            inPosition.x = this.game.width;
            outPosition.x = -this.game.width;
        } else if (this.direction == Push.DIRECTION.LEFT_BOTTOM) {
            inPosition.x = this.game.width;
            outPosition.x = -this.game.width;
            inPosition.y = -this.game.height;
            outPosition.y = this.game.height;
        } else if (this.direction == Push.DIRECTION.BOTTOM) {
            inPosition.y = -this.game.height;
            outPosition.y = this.game.height;
        } else if (this.direction == Push.DIRECTION.RIGHT_BOTTOM) {
            inPosition.x = -this.game.width;
            outPosition.x = this.game.width;
            inPosition.y = -this.game.height;
            outPosition.y = this.game.height;
        } else if (this.direction == Push.DIRECTION.RIGHT) {
            inPosition.x = -this.game.width;
            outPosition.x = this.game.width;
        } else if (this.direction == Push.DIRECTION.RIGHT_TOP) {
            inPosition.x = -this.game.width;
            outPosition.x = this.game.width;
            inPosition.y = this.game.height;
            outPosition.y = -this.game.height;
        } else if (this.direction == Push.DIRECTION.TOP) {
            inPosition.y = this.game.height;
            outPosition.y = -this.game.height;
        } else if (this.direction == Push.DIRECTION.LEFT_TOP) {
            inPosition.x = this.game.width;
            outPosition.x = -this.game.width;
            inPosition.y = this.game.height;
            outPosition.y = -this.game.height;
        }

        return position;
    }

    complete() {
        this.game.tweens.remove(this.tweenIn);
        this.game.tweens.remove(this.tweenOut);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        super.complete();
    }
}
