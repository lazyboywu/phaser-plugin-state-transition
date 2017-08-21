/// <reference path='../definitions.d.ts'/>

import View from '../view';
import Base from './base';

export default class Shutter extends Base {

    direction: string;
    lineWidth: number;
    tween: Phaser.Tween;
    mask: any;

    static DIRECTION = {
        HORIZONTAL: 'HORIZONTAL',
        VERTICAL: 'VERTICAL',
    }

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);

        this.direction = this.get(data, 'direction', Shutter.DIRECTION.HORIZONTAL);

        this.lineWidth = 64;
    }

    run() {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        this.inView.visible = false;

        this.mask = this.game.make.graphics(0, 0);
        this.mask.beginFill(0xFFFFFF);

        var that = this;
        var processStart;
        var processEnd;
        if (this.direction === Shutter.DIRECTION.VERTICAL) {
            processStart = {
                set barWidth(barWidth) {
                    that.fillBar(barWidth);
                },
                get barWidth() {
                    return 0;
                }
            }
            processEnd = {
                barWidth: this.lineWidth,
            }
        } else if (this.direction === Shutter.DIRECTION.HORIZONTAL) {
            processStart = {
                set lineWidth(lineWidth) {
                    that.fillLine(lineWidth);
                },
                get lineWidth() {
                    return 0;
                }
            }
            processEnd = {
                lineWidth: this.lineWidth,
            }
        }


        var tween = this.game.add.tween(processStart);
        tween.to(processEnd, 1000, Phaser.Easing.Linear.None, true);

        tween.onStart.addOnce(this.onStartHandle, this);
        tween.onComplete.addOnce(this.complete, this);

        this.tween = tween;
    }

    onStartHandle() {
        this.inView.mask = this.mask;
        this.inView.visible = true;
    }

    fillLine(lineWidth: number) {
        var w = this.game.width / this.inView.scale.x;

        for (var x = 0; x < w; x += this.lineWidth) {
            this.mask.drawRect(x, 0, lineWidth, this.game.height);
        }
    }

    fillBar(barWidth: number) {
        var h = this.game.height / this.inView.scale.y;

        for (var x = 0; x < h; x += this.lineWidth) {
            this.mask.drawRect(0, x, this.game.width, barWidth);
        }
    }

    complete() {
        this.mask.destroy();
        this.inView.mask = null;
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        super.complete();
    }
}
