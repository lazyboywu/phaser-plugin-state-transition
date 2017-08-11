/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Box extends Base {
    static DIRECTION = {
        SPREAD: 'SPREAD',
        SHRINK: 'SHRINK',
    }

    direction: string;
    tween: Phaser.Tween;

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);
        this.direction = _.get(data, 'direction', Box.DIRECTION.SPREAD);
    }

    run() {
        var mask: any = this.game.add.graphics(0, 0);
        
        mask.anchor.setTo(0.5, 0.5);
        mask.x = this.game.width / 2;
        mask.y = this.game.height / 2;

        mask.beginFill(0xFFFFFF);
        mask.drawRect(-mask.x, -mask.y, this.game.width, this.game.height);

        var tween;
        if (this.direction == Box.DIRECTION.SPREAD) {
            this.game.world.add(this.outView);
            this.game.world.add(this.inView);
            this.inView.mask = mask;
            tween = this.game.add.tween(this.inView.mask.scale);
            tween.from(
                { x: 0, y: 0 },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        } else if (this.direction == Box.DIRECTION.SHRINK) {
            this.game.world.add(this.inView);
            this.game.world.add(this.outView);
            this.outView.mask = mask;
            tween = this.game.add.tween(this.outView.mask.scale);
            tween.to(
                { x: 0, y: 0 },
                1000,
                Phaser.Easing.Linear.None,
                true
            );
        }

        tween.onComplete.addOnce(this.complete, this);

        this.tween = tween;
    }

    complete() {

        if (this.inView.mask) {
            this.inView.mask.destroy();
        } else if (this.outView.mask) {
            this.outView.mask.destroy();
        }

        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);

        super.complete();
    }
}
