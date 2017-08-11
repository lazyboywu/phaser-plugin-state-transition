/// <reference path='../definitions.d.ts'/>
import * as _ from 'lodash';

import View from '../view';
import Base from './base';

export default class Chessboard extends Base {

    direction: string;
    tileWidth: number;
    tileHeight: number;
    tween: Phaser.Tween;
    mask: any;

    static DIRECTION = {
        HORIZONTAL: 'HORIZONTAL',
        VERTICAL: 'VERTICAL',
    }

    constructor(game: Phaser.Game, outView: View, inView: View, data?: object) {
        super(game, outView, inView);

        this.direction = _.get(data, 'direction', Chessboard.DIRECTION.HORIZONTAL);

        this.tileWidth = 160;
        this.tileHeight = 80;
    }

    run() {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        this.inView.visible = false;

        this.mask = this.game.make.graphics(0, 0);
        this.mask.beginFill(0xFFFFFF);

        var tiles = this.createTiles();

        var that = this;
        var processStart;
        var processEnd;
        if (this.direction === Chessboard.DIRECTION.VERTICAL) {
            processStart = {
                set tileWidth(tileWidth) {
                    that.fillVerticalTile(tileWidth, tiles);
                },
                get tileWidth() {
                    return 0;
                }
            }
            processEnd = {
                tileWidth: this.tileWidth,
            }
        } else if (this.direction === Chessboard.DIRECTION.HORIZONTAL) {
            processStart = {
                set tileWidth(tileWidth) {
                    that.fillHorizontalTile(tileWidth, tiles);
                },
                get tileWidth() {
                    return 0;
                }
            }
            processEnd = {
                tileWidth: this.tileWidth,
            }
        }


        var tween = this.game.add.tween(processStart);
        tween.to(processEnd, 2000, Phaser.Easing.Linear.None, true);

        tween.onStart.addOnce(this.onStartHandle, this);
        tween.onComplete.addOnce(this.complete, this);

        this.tween = tween;
    }

    onStartHandle() {
        this.inView.mask = this.mask;
        this.inView.visible = true;
    }

    createTiles() {
        var w = this.game.width / this.inView.scale.x;
        var h = this.game.height / this.inView.scale.y;


        var tiles: number[][][] = [];

        if (this.direction === Chessboard.DIRECTION.VERTICAL) {
            for (var x = 0; x < w; x += this.tileHeight) {
                var tempTiles: number[][] = [];
                for (var y = 0; y < h; y += this.tileWidth) {
                    tempTiles.push([x, y]);
                }
                tiles.push(tempTiles);
            }
        } else if (this.direction === Chessboard.DIRECTION.HORIZONTAL) {
            for (var y = 0; y < h; y += this.tileHeight) {
                var tempTiles: number[][] = [];
                for (var x = 0; x < w; x += this.tileWidth) {
                    tempTiles.push([x, y]);
                }
                tiles.push(tempTiles);
            }
        }


        return tiles;
    }

    fillVerticalTile(tileWidth: number, tiles: number[][][]) {
        var len = tiles.length;

        for (var i = 0; i < len; i++) {
            var tempTiles = tiles[i];
            if (i % 2 == 0) {
                for (var j = 0; j < tempTiles.length; j++) {
                    var [x, y] = tempTiles[j];
                    this.mask.drawRect(x, y - this.tileHeight / 2, this.tileHeight, tileWidth);//垂直棋盘将tile的宽高概念互换
                }
            } else {
                for (var k = 0; k < tempTiles.length; k++) {
                    var [x, y] = tempTiles[k];
                    this.mask.drawRect(x, y, this.tileHeight, tileWidth);
                }
            }
        }
    }

    fillHorizontalTile(tileWidth: number, tiles: number[][][]) {
        var len = tiles.length;

        for (var i = 0; i < len; i++) {
            var tempTiles = tiles[i];
            if (i % 2 == 0) {
                var [lastX, lastY] = tempTiles[tempTiles.length - 1];
                console.log(lastX);
                for (var j = 0; j < tempTiles.length; j++) {
                    var [x, y] = tempTiles[j];
                    this.mask.drawRect(x - this.tileWidth / 2, y, tileWidth, this.tileHeight);
                }
                this.mask.drawRect(lastX + this.tileWidth / 2, lastY, tileWidth, this.tileHeight);//偶数行每一块往左移了this.tileWidth / 2，所以在最后补上一块
            } else {
                for (var k = 0; k < tempTiles.length; k++) {
                    var [x, y] = tempTiles[k];
                    this.mask.drawRect(x, y, tileWidth, this.tileHeight);
                }
            }
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
