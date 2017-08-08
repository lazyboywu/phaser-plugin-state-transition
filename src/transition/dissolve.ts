/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Dissolve extends Base {

    tween: Phaser.Tween;
    bmd: Phaser.BitmapData;
    copeImage: Phaser.Image;

    constructor(game: Phaser.Game, outView: View, inView: View) {
        super(game, outView, inView);
    }

    run() {
        this.game.world.add(this.outView);
        //this.game.world.add(this.inView);

        var w = this.game.width / this.inView.scale.x;
        var h = this.game.height / this.inView.scale.y;

        var tileWidth = 50;
        var tileHeight = 50;
        var tiles = [];
        var temp: number[][];

        this.bmd = this.game.make.bitmapData(w, h);
        this.copeImage = this.bmd.addToWorld(0, 0, 0, 0, this.inView.scale.x, this.inView.scale.y);

        for (var y = 0; y < h; y += tileHeight) {
            for (var x = 0; x < w; x += tileWidth) {
                tiles.push([x, y]);
            }
        }

        temp = tiles.slice(0);

        var tempLen = temp.length;

        Phaser.ArrayUtils.shuffle(temp);

        var that = this;
        var processStart = {
            set tileIndex(tileIndex) {
                tileIndex = Math.floor(tileIndex)
                while (tempLen - tileIndex < temp.length) {
                    var [x, y] = temp.pop();
                    var tempRect = new Phaser.Rectangle(x, y, tileWidth, tileHeight);
                    that.bmd.copyRect(that.inView, tempRect, x, y);
                }
            },
            get tileIndex() {
                return 0;
            }
        }
        var processEnd = {
            tileIndex: tempLen,
        }

        var tween = this.game.add.tween(processStart);
        tween.to(processEnd, 1000,Phaser.Easing.Linear.None,true)
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
