/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Line extends Base {

    tween: Phaser.Tween;
    bmd: Phaser.BitmapData;
    copeImage: Phaser.Image;

    constructor(game: Phaser.Game, outView: View, inView: View) {
        super(game, outView, inView);
    }

    run() {
        this.game.world.add(this.outView);
        //this.game.world.add(this.inView);

        var w = this.game.width;
        var h = this.game.height;

        var barWidth = 6;
        var bars = [];
        var temp: number[] = [];

        this.bmd = this.game.make.bitmapData(w, h);
        this.copeImage = this.bmd.addToWorld();

        for (var x = 0; x < w; x += barWidth) {
            bars.push(x);
        }

        temp = bars.slice(0);

        Phaser.ArrayUtils.shuffle(temp);

        var tempLen = temp.length;

        Phaser.ArrayUtils.shuffle(temp);

        var that = this;
        var processStart = {
            set barIndex(barIndex) {
                barIndex = Math.floor(barIndex)
                while (tempLen - barIndex < temp.length) {
                    var xValue = temp.pop();
                    var tempRect = new Phaser.Rectangle(xValue, 0, barWidth, h);
                    that.bmd.copyRect(that.inView, tempRect, xValue, 0);
                }
            },
            get barIndex() {
                return 0;
            }
        }
        var processEnd = {
            barIndex: tempLen,
        }
        var tween = this.game.add.tween(processStart);
        tween.to(processEnd, 1000, Phaser.Easing.Linear.None, true)
        tween.onComplete.addOnce(this.complete, this);

        this.tween = tween;
    }

    complete() {
        if (this.copeImage) {
            this.copeImage.destroy();
        }
        if (this.bmd) {
            this.bmd.destroy();
        }
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        super.complete();
    }
}
