/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Dissolve extends Base {
    tileWidth: number;
    tileHeight: number;
    tween: Phaser.Tween;
    mask: any;



    constructor(game: Phaser.Game, outView: View, inView: View) {
        super(game, outView, inView);

        this.tileWidth = 50;
        this.tileHeight = 50;
    }

    run() {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        this.inView.visible = false;

        var mask = this.game.make.graphics(0, 0);
        mask.beginFill(0xFFFFFF);
        this.mask = mask;
        // this.inView.mask = mask;

        var tiles = this.createTiles();
        var maxLength = tiles.length;

        var that = this;
        var processStart = {
            set tileIndex(tileIndex) {
                that.fillTile(tileIndex, tiles, maxLength);
            },
            get tileIndex() {
                return 0;
            }
        }
        var processEnd = {
            tileIndex: maxLength,
        }

        var tween = this.game.add.tween(processStart);
        tween.to(processEnd, 1000,Phaser.Easing.Linear.None,true)
        tween.onComplete.addOnce(this.complete, this);

        this.tween = tween;
    }

    createTiles() {
        var w = this.game.width / this.inView.scale.x;
        var h = this.game.height / this.inView.scale.y;


        var tiles: number[][] = [];

        for (var y = 0; y < h; y += this.tileHeight) {
            for (var x = 0; x < w; x += this.tileWidth) {
                tiles.push([x, y]);
            }
        }

        tiles = tiles.slice(0);
        Phaser.ArrayUtils.shuffle(tiles);

        return tiles;
    }

    fillTile(tileIndex: number, tiles: number[][], maxLength: number) {
        if (maxLength === tiles.length) {
            this.inView.mask = this.mask;
            this.inView.visible = true;
        }
        tileIndex = Math.floor(tileIndex)
        while (maxLength - tileIndex < tiles.length) {
            var [x, y] = tiles.pop();
            this.mask.drawRect(x, y, this.tileWidth, this.tileHeight);
        }
        if (tiles.length === 0) {
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
