/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Line extends Base {

    lineWidth: number;
    tween: Phaser.Tween;
    mask: any;

    constructor(game: Phaser.Game, outView: View, inView: View) {
        super(game, outView, inView);

        this.lineWidth = 6;
    }

    run() {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        this.inView.visible = false;

        var mask = this.game.make.graphics(0, 0);
        mask.beginFill(0xFFFFFF);
        this.mask = mask;

        var lines = this.createLines();
        var maxLength = lines.length;

        var that = this;
        var processStart = {
            set tileIndex(tileIndex) {
                that.fillLine(tileIndex, lines, maxLength);
            },
            get tileIndex() {
                return 0;
            }
        }
        var processEnd = {
            tileIndex: maxLength,
        }


        var tween = this.game.add.tween(processStart);
        tween.to(processEnd, 1000, Phaser.Easing.Linear.None, true)
        tween.onComplete.addOnce(this.complete, this);

        this.tween = tween;
    }

    createLines() {
        var w = this.game.width / this.inView.scale.x;

        var lines: number[] = [];

        for (var x = 0; x < w; x += this.lineWidth) {
            lines.push(x);
        }

        lines = lines.slice(0);
        Phaser.ArrayUtils.shuffle(lines);

        return lines;
    }

    fillLine(tileIndex: number, lines: number[], maxLength: number) {
        if (maxLength === lines.length) {
            this.inView.mask = this.mask;
            this.inView.visible = true;
        }
        tileIndex = Math.floor(tileIndex)
        while (maxLength - tileIndex < lines.length) {
            var x = lines.pop();
            this.mask.drawRect(x, 0, this.lineWidth, this.game.height);
        }
        if (lines.length === 0) {
            this.mask.destroy();
            this.inView.mask = null;
        }
    }

    complete() {
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        super.complete();
    }
}
