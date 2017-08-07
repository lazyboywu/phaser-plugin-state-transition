/// <reference path='../definitions.d.ts'/>

import View from '../view';

import Base from './base';

export default class Clock extends Base {
    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);
    }

    run() {
        this.game.world.add(this.inView);
        this.game.world.add(this.outView);

        var mask = this.game.add.graphics(0, 0);
        var that = this;

        //用于修复起始边转动的问题
        var fixOutView = new View(this.game);
        this.game.world.add(fixOutView);
        var fixMask = this.game.add.graphics(0, 0);
        var fixAngle = 10;//修复的角度，这里取10度
        fixMask.beginFill(0xFFFFFF);
        fixMask.drawPolygon([
            { x: this.game.width / 2, y: 0 },
            { x: this.game.width / 2, y: this.game.height / 2 },
            { x: this.game.width / 2 - this.game.height / 2 * Math.tan(Phaser.Math.degToRad(fixAngle)), y: 0 }
        ]);
        fixOutView.mask = fixMask;

        var angleStart = {
            set angleCount(angleCount) {
                angleCount = Math.floor(angleCount);
                var endAngle = angleCount * 10 - 90;
                if (endAngle > 270 - fixAngle) {
                    fixMask.destroy();
                    fixOutView.destroy();
                }
                mask.clear();
                mask.beginFill(0xFFFFFF);
                mask.arc(
                    that.game.width / 2,
                    that.game.height / 2,
                    Math.sqrt(that.game.width * that.game.width + that.game.height * that.game.height),
                    Phaser.Math.degToRad(-90),
                    Phaser.Math.degToRad(endAngle),
                    true
                );
            },
            get angleCount() {
                return 0;
            }
        };

        var angleEnd = {
            angleCount: 36,
        };

        var tween = this.game.add.tween(angleStart);
        tween.to(angleEnd, 1000, Phaser.Easing.Linear.None, true);

        var that = this;
        tween.onStart.addOnce(function () {
            that.outView.mask = mask;
        }, this);
        tween.onComplete.addOnce(this.complete, this);
    }

    complete() {
        if (this.outView.mask) {
            this.outView.mask.destroy();
        }
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        super.complete();
    }
}
