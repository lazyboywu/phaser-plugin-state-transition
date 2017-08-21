/**
 * phaser-plugin-state-transition - State Transition Plugin for Phaser
 * @version v0.1.0
 * @link https://github.com/lazyboywu/phaser-plugin-state-transition
 * @license MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path='./definitions.d.ts'/>
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("./view");
var transition_1 = require("./transition");
var Manager = (function () {
    function Manager(game) {
        this.game = game;
        // 添加 game 属性 stateTransition
        Object.defineProperty(game, 'stateTransition', {
            value: this
        });
    }
    Manager.prototype.start = function (stateKey, transitionData, clearWorld, clearCache) {
        var args = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            args[_i - 4] = arguments[_i];
        }
        var outView = new view_1.default(this.game);
        var state = this.game.state.states[stateKey];
        var _this = this;
        (function (state, transitionData, outView) {
            var oldCreate = state.create;
            // 替换 create 方法
            state.create = function () {
                oldCreate.call(state);
                var inView = new view_1.default(this.game);
                var transition = transition_1.default.factory.create(this.game, outView, inView, transitionData);
                if (!transition) {
                    return;
                }
                state.game.state._created = false;
                transition.onComplete.addOnce(function () {
                    state.game.state._created = true;
                    // 还原 create 方法
                    state.create = oldCreate;
                    // 增加一个执行回调函数
                    var postTransit = state.postTransit;
                    if (postTransit && typeof postTransit === 'function') {
                        postTransit.call(state);
                    }
                });
                transition.run();
            };
        })(state, transitionData, outView);
        (_a = this.game.state).start.apply(_a, [stateKey, true, clearCache].concat(args));
        var _a;
    };
    return Manager;
}());
var StateTransition = window.StateTransition = { Manager: Manager, Transition: transition_1.default, View: view_1.default };
exports.default = StateTransition;

},{"./transition":11,"./view":20}],2:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Base = (function () {
    function Base(game, outView, inView, data) {
        this.onComplete = new Phaser.Signal();
        this.game = game;
        this.outView = outView;
        this.inView = inView;
    }
    Base.prototype.get = function (data, key, def) {
        var result;
        if (data != null && Object.prototype.hasOwnProperty.call(data, key)) {
            result = data[key];
        }
        else {
            result = def;
        }
        return result;
    };
    Base.prototype.run = function () {
        // nothing
    };
    Base.prototype.complete = function () {
        if (this.outView) {
            this.inView.destroy();
        }
        if (this.outView) {
            this.inView.destroy();
        }
        this.onComplete.dispatch();
        this.game = null;
    };
    return Base;
}());
exports.default = Base;

},{}],3:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Box = (function (_super) {
    __extends(Box, _super);
    function Box(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.direction = _this.get(data, 'direction', Box.DIRECTION.SPREAD);
        return _this;
    }
    Box.prototype.run = function () {
        var mask = this.game.add.graphics(0, 0);
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
            tween.from({ x: 0, y: 0 }, 1000, Phaser.Easing.Linear.None, true);
        }
        else if (this.direction == Box.DIRECTION.SHRINK) {
            this.game.world.add(this.inView);
            this.game.world.add(this.outView);
            this.outView.mask = mask;
            tween = this.game.add.tween(this.outView.mask.scale);
            tween.to({ x: 0, y: 0 }, 1000, Phaser.Easing.Linear.None, true);
        }
        tween.onComplete.addOnce(this.complete, this);
        this.tween = tween;
    };
    Box.prototype.complete = function () {
        if (this.inView.mask) {
            this.inView.mask.destroy();
        }
        else if (this.outView.mask) {
            this.outView.mask.destroy();
        }
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Box;
}(base_1.default));
Box.DIRECTION = {
    SPREAD: 'SPREAD',
    SHRINK: 'SHRINK',
};
exports.default = Box;

},{"./base":2}],4:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Bulletin = (function (_super) {
    __extends(Bulletin, _super);
    function Bulletin(game, outView, inView, data) {
        return _super.call(this, game, outView, inView) || this;
    }
    Bulletin.prototype.run = function () {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        this.inView.anchor.setTo(0.5, 0.5);
        this.inView.top = 0;
        this.inView.left = 0;
        var tweenRotate = this.game.add.tween(this.inView);
        tweenRotate.from({ angle: 180 }, 1000, Phaser.Easing.Linear.None, true);
        var tweenScale = this.game.add.tween(this.inView.scale);
        tweenScale.from({ x: 0, y: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tweenRotate.onComplete.addOnce(this.complete, this);
        this.tweenRotate = tweenRotate;
        this.tweenScale = tweenScale;
    };
    Bulletin.prototype.complete = function () {
        this.game.tweens.remove(this.tweenRotate);
        this.game.tweens.remove(this.tweenScale);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Bulletin;
}(base_1.default));
exports.default = Bulletin;

},{"./base":2}],5:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Chessboard = (function (_super) {
    __extends(Chessboard, _super);
    function Chessboard(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.direction = _this.get(data, 'direction', Chessboard.DIRECTION.HORIZONTAL);
        _this.tileWidth = 160;
        _this.tileHeight = 80;
        return _this;
    }
    Chessboard.prototype.run = function () {
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
            };
            processEnd = {
                tileWidth: this.tileWidth,
            };
        }
        else if (this.direction === Chessboard.DIRECTION.HORIZONTAL) {
            processStart = {
                set tileWidth(tileWidth) {
                    that.fillHorizontalTile(tileWidth, tiles);
                },
                get tileWidth() {
                    return 0;
                }
            };
            processEnd = {
                tileWidth: this.tileWidth,
            };
        }
        var tween = this.game.add.tween(processStart);
        tween.to(processEnd, 2000, Phaser.Easing.Linear.None, true);
        tween.onStart.addOnce(this.onStartHandle, this);
        tween.onComplete.addOnce(this.complete, this);
        this.tween = tween;
    };
    Chessboard.prototype.onStartHandle = function () {
        this.inView.mask = this.mask;
        this.inView.visible = true;
    };
    Chessboard.prototype.createTiles = function () {
        var w = this.game.width / this.inView.scale.x;
        var h = this.game.height / this.inView.scale.y;
        var tiles = [];
        if (this.direction === Chessboard.DIRECTION.VERTICAL) {
            for (var x = 0; x < w; x += this.tileHeight) {
                var tempTiles = [];
                for (var y = 0; y < h; y += this.tileWidth) {
                    tempTiles.push([x, y]);
                }
                tiles.push(tempTiles);
            }
        }
        else if (this.direction === Chessboard.DIRECTION.HORIZONTAL) {
            for (var y = 0; y < h; y += this.tileHeight) {
                var tempTiles = [];
                for (var x = 0; x < w; x += this.tileWidth) {
                    tempTiles.push([x, y]);
                }
                tiles.push(tempTiles);
            }
        }
        return tiles;
    };
    Chessboard.prototype.fillVerticalTile = function (tileWidth, tiles) {
        var len = tiles.length;
        for (var i = 0; i < len; i++) {
            var tempTiles = tiles[i];
            if (i % 2 == 0) {
                for (var j = 0; j < tempTiles.length; j++) {
                    var _a = tempTiles[j], x = _a[0], y = _a[1];
                    this.mask.drawRect(x, y - this.tileHeight / 2, this.tileHeight, tileWidth); //垂直棋盘将tile的宽高概念互换
                }
            }
            else {
                for (var k = 0; k < tempTiles.length; k++) {
                    var _b = tempTiles[k], x = _b[0], y = _b[1];
                    this.mask.drawRect(x, y, this.tileHeight, tileWidth);
                }
            }
        }
    };
    Chessboard.prototype.fillHorizontalTile = function (tileWidth, tiles) {
        var len = tiles.length;
        for (var i = 0; i < len; i++) {
            var tempTiles = tiles[i];
            if (i % 2 == 0) {
                var _a = tempTiles[tempTiles.length - 1], lastX = _a[0], lastY = _a[1];
                for (var j = 0; j < tempTiles.length; j++) {
                    var _b = tempTiles[j], x = _b[0], y = _b[1];
                    this.mask.drawRect(x - this.tileWidth / 2, y, tileWidth, this.tileHeight);
                }
                this.mask.drawRect(lastX + this.tileWidth / 2, lastY, tileWidth, this.tileHeight); //偶数行每一块往左移了this.tileWidth / 2，所以在最后补上一块
            }
            else {
                for (var k = 0; k < tempTiles.length; k++) {
                    var _c = tempTiles[k], x = _c[0], y = _c[1];
                    this.mask.drawRect(x, y, tileWidth, this.tileHeight);
                }
            }
        }
    };
    Chessboard.prototype.complete = function () {
        this.mask.destroy();
        this.inView.mask = null;
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Chessboard;
}(base_1.default));
Chessboard.DIRECTION = {
    HORIZONTAL: 'HORIZONTAL',
    VERTICAL: 'VERTICAL',
};
exports.default = Chessboard;

},{"./base":2}],6:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../view");
var base_1 = require("./base");
var Clock = (function (_super) {
    __extends(Clock, _super);
    function Clock(game, outView, inView, data) {
        return _super.call(this, game, outView, inView) || this;
    }
    Clock.prototype.run = function () {
        this.game.world.add(this.inView);
        this.game.world.add(this.outView);
        var mask = this.game.add.graphics(0, 0);
        var that = this;
        //用于修复起始边转动的问题
        var fixOutView = new view_1.default(this.game);
        this.game.world.add(fixOutView);
        var fixMask = this.game.add.graphics(0, 0);
        var fixAngle = 10; //修复的角度，这里取10度
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
                mask.arc(that.game.width / 2, that.game.height / 2, Math.sqrt(that.game.width * that.game.width + that.game.height * that.game.height), Phaser.Math.degToRad(-90), Phaser.Math.degToRad(endAngle), true);
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
    };
    Clock.prototype.complete = function () {
        if (this.outView.mask) {
            this.outView.mask.destroy();
        }
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Clock;
}(base_1.default));
exports.default = Clock;

},{"../view":20,"./base":2}],7:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Cover = (function (_super) {
    __extends(Cover, _super);
    function Cover(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.direction = _this.get(data, 'direction', Cover.DIRECTION.LEFT);
        return _this;
    }
    Cover.prototype.run = function () {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        var tween = this.game.add.tween(this.inView);
        var position = this.calculatePosition();
        tween.from(position, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.addOnce(this.complete, this);
        this.tween = tween;
    };
    Cover.prototype.calculatePosition = function () {
        var position = {
            x: this.inView.x,
            y: this.inView.y,
        };
        if (this.direction == Cover.DIRECTION.LEFT) {
            position.x = this.game.width;
        }
        else if (this.direction == Cover.DIRECTION.LEFT_BOTTOM) {
            position.x = this.game.width;
            position.y = -this.game.height;
        }
        else if (this.direction == Cover.DIRECTION.BOTTOM) {
            position.y = -this.game.height;
        }
        else if (this.direction == Cover.DIRECTION.RIGHT_BOTTOM) {
            position.x = -this.game.width;
            position.y = -this.game.height;
        }
        else if (this.direction == Cover.DIRECTION.RIGHT) {
            position.x = -this.game.width;
        }
        else if (this.direction == Cover.DIRECTION.RIGHT_TOP) {
            position.x = -this.game.width;
            position.y = this.game.height;
        }
        else if (this.direction == Cover.DIRECTION.TOP) {
            position.y = this.game.height;
        }
        else if (this.direction == Cover.DIRECTION.LEFT_TOP) {
            position.x = this.game.width;
            position.y = this.game.height;
        }
        return position;
    };
    Cover.prototype.complete = function () {
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Cover;
}(base_1.default));
Cover.DIRECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    LEFT_TOP: 'LEFT_TOP',
    RIGHT_TOP: 'RIGHT_TOP',
    LEFT_BOTTOM: 'LEFT_BOTTOM',
    RIGHT_BOTTOM: 'RIGHT_BOTTOM',
};
exports.default = Cover;

},{"./base":2}],8:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Dissolve = (function (_super) {
    __extends(Dissolve, _super);
    function Dissolve(game, outView, inView) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.tileWidth = 50;
        _this.tileHeight = 50;
        return _this;
    }
    Dissolve.prototype.run = function () {
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
        };
        var processEnd = {
            tileIndex: maxLength,
        };
        var tween = this.game.add.tween(processStart);
        tween.onStart.addOnce(this.onStartHandle, this);
        tween.onComplete.addOnce(this.complete, this);
        tween.to(processEnd, 1000, Phaser.Easing.Linear.None, true);
        this.tween = tween;
    };
    Dissolve.prototype.onStartHandle = function () {
        this.inView.mask = this.mask;
        this.inView.visible = true;
    };
    Dissolve.prototype.createTiles = function () {
        var w = this.game.width / this.inView.scale.x;
        var h = this.game.height / this.inView.scale.y;
        var tiles = [];
        for (var y = 0; y < h; y += this.tileHeight) {
            for (var x = 0; x < w; x += this.tileWidth) {
                tiles.push([x, y]);
            }
        }
        tiles = tiles.slice(0);
        Phaser.ArrayUtils.shuffle(tiles);
        return tiles;
    };
    Dissolve.prototype.fillTile = function (tileIndex, tiles, maxLength) {
        tileIndex = Math.floor(tileIndex);
        while (maxLength - tileIndex < tiles.length) {
            var _a = tiles.pop(), x = _a[0], y = _a[1];
            this.mask.drawRect(x, y, this.tileWidth, this.tileHeight);
        }
    };
    Dissolve.prototype.complete = function () {
        this.mask.destroy();
        this.inView.mask = null;
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Dissolve;
}(base_1.default));
exports.default = Dissolve;

},{"./base":2}],9:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Factory = (function () {
    function Factory() {
        this.creators = {};
    }
    Factory.prototype.add = function (type, creator) {
        this.creators[type] = creator;
    };
    /**
     *
     * @param {Phaser.Game} game
     * @return {Base}
     */
    Factory.prototype.create = function (game, outView, inView, data) {
        // 没有包含类型
        if (!data || !Object.prototype.hasOwnProperty.call(data, 'type')) {
            console.error('Phaser Plugin Transition Factory: can not find type property ');
            return null;
        }
        var type = data.type;
        if (!Object.prototype.hasOwnProperty.call(this.creators, type)) {
            console.error('Phaser Plugin Transition Factory: create ' + type + ' not found', type);
            return null;
        }
        return new this.creators[type](game, outView, inView, data);
    };
    return Factory;
}());
exports.default = Factory;

},{}],10:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Fade = (function (_super) {
    __extends(Fade, _super);
    function Fade(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.tipe = _this.get(data, 'tipe', Fade.TIPE.BLACK);
        return _this;
    }
    Fade.prototype.run = function () {
        //this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        if (this.tipe == Fade.TIPE.BLACK) {
            var blackRectangle = this.game.add.graphics(0, 0);
            blackRectangle.beginFill(0x000000);
            blackRectangle.drawRect(0, 0, this.game.width, this.game.height);
            this.game.world.add(blackRectangle);
            this.game.world.add(this.outView);
            var tweenOut = this.game.add.tween(this.outView);
            tweenOut.to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false);
            var tweenIn = this.game.add.tween(blackRectangle);
            tweenIn.to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false);
            tweenOut.chain(tweenIn);
            tweenOut.start();
            tweenIn.onComplete.addOnce(this.complete, this);
            this.tweenIn = tweenIn;
            this.tweenOut = tweenOut;
            this.blackRectangle = blackRectangle;
        }
        else {
            this.game.world.add(this.outView);
            var tweenOut = this.game.add.tween(this.outView);
            tweenOut.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tweenOut.onComplete.addOnce(this.complete, this);
            this.tweenOut = tweenOut;
        }
    };
    Fade.prototype.complete = function () {
        if (this.tweenOut) {
            this.game.tweens.remove(this.tweenOut);
        }
        if (this.tweenIn) {
            this.game.tweens.remove(this.tweenIn);
        }
        if (this.blackRectangle) {
            this.blackRectangle.destroy();
        }
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Fade;
}(base_1.default));
Fade.TIPE = {
    BLACK: 'BLACK',
    SMOOTHLY: 'SMOOTHLY',
};
exports.default = Fade;

},{"./base":2}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var box_1 = require("./box");
var bulletin_1 = require("./bulletin");
var chessboard_1 = require("./chessboard");
var clock_1 = require("./clock");
var cover_1 = require("./cover");
var dissolve_1 = require("./dissolve");
var fade_1 = require("./fade");
var line_1 = require("./line");
var push_1 = require("./push");
var shape_1 = require("./shape");
var shutter_1 = require("./shutter");
var shrink_1 = require("./shrink");
var spread_1 = require("./spread");
var uncover_1 = require("./uncover");
var wipe_1 = require("./wipe");
var factory_1 = require("./factory");
var factory = new factory_1.default();
factory.add('box', box_1.default);
factory.add('bulletin', bulletin_1.default);
factory.add('chessboard', chessboard_1.default);
factory.add('clock', clock_1.default);
factory.add('cover', cover_1.default);
factory.add('dissolve', dissolve_1.default);
factory.add('fade', fade_1.default);
factory.add('line', line_1.default);
factory.add('push', push_1.default);
factory.add('shape', shape_1.default);
factory.add('shrink', shrink_1.default);
factory.add('shutter', shutter_1.default);
factory.add('spread', spread_1.default);
factory.add('uncover', uncover_1.default);
factory.add('wipe', wipe_1.default);
exports.default = {
    Base: base_1.default,
    factory: factory,
    Box: box_1.default,
    Bulletin: bulletin_1.default,
    Chessboard: chessboard_1.default,
    Clock: clock_1.default,
    Cover: cover_1.default,
    Dissolve: dissolve_1.default,
    Fade: fade_1.default,
    Line: line_1.default,
    Push: push_1.default,
    Shape: shape_1.default,
    Shrink: shrink_1.default,
    Shutter: shutter_1.default,
    Spread: spread_1.default,
    Uncover: uncover_1.default,
    Wipe: wipe_1.default,
};

},{"./base":2,"./box":3,"./bulletin":4,"./chessboard":5,"./clock":6,"./cover":7,"./dissolve":8,"./factory":9,"./fade":10,"./line":12,"./push":13,"./shape":14,"./shrink":15,"./shutter":16,"./spread":17,"./uncover":18,"./wipe":19}],12:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(game, outView, inView) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.lineWidth = 6;
        return _this;
    }
    Line.prototype.run = function () {
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
            set lineIndex(lineIndex) {
                that.fillLine(lineIndex, lines, maxLength);
            },
            get lineIndex() {
                return 0;
            }
        };
        var processEnd = {
            lineIndex: maxLength,
        };
        var tween = this.game.add.tween(processStart);
        tween.to(processEnd, 1000, Phaser.Easing.Linear.None, true);
        tween.onStart.addOnce(this.onStartHandle, this);
        tween.onComplete.addOnce(this.complete, this);
        this.tween = tween;
    };
    Line.prototype.onStartHandle = function () {
        this.inView.mask = this.mask;
        this.inView.visible = true;
    };
    Line.prototype.createLines = function () {
        var w = this.game.width / this.inView.scale.x;
        var lines = [];
        for (var x = 0; x < w; x += this.lineWidth) {
            lines.push(x);
        }
        lines = lines.slice(0);
        Phaser.ArrayUtils.shuffle(lines);
        return lines;
    };
    Line.prototype.fillLine = function (lineIndex, lines, maxLength) {
        lineIndex = Math.floor(lineIndex);
        while (maxLength - lineIndex < lines.length) {
            var x = lines.pop();
            this.mask.drawRect(x, 0, this.lineWidth, this.game.height);
        }
    };
    Line.prototype.complete = function () {
        this.mask.destroy();
        this.inView.mask = null;
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Line;
}(base_1.default));
exports.default = Line;

},{"./base":2}],13:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Push = (function (_super) {
    __extends(Push, _super);
    function Push(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.direction = _this.get(data, 'direction', Push.DIRECTION.LEFT);
        return _this;
    }
    Push.prototype.run = function () {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        var tweenIn = this.game.add.tween(this.inView);
        var tweenOut = this.game.add.tween(this.outView);
        var position = this.calculatePosition();
        tweenOut.to(position.outPosition, 1000, Phaser.Easing.Linear.None, true);
        tweenIn.from(position.inPosition, 1000, Phaser.Easing.Linear.None, true);
        tweenIn.onComplete.addOnce(this.complete, this);
        this.tweenIn = tweenIn;
        this.tweenOut = tweenOut;
    };
    Push.prototype.calculatePosition = function () {
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
        };
        if (this.direction == Push.DIRECTION.LEFT) {
            inPosition.x = this.game.width;
            outPosition.x = -this.game.width;
        }
        else if (this.direction == Push.DIRECTION.LEFT_BOTTOM) {
            inPosition.x = this.game.width;
            outPosition.x = -this.game.width;
            inPosition.y = -this.game.height;
            outPosition.y = this.game.height;
        }
        else if (this.direction == Push.DIRECTION.BOTTOM) {
            inPosition.y = -this.game.height;
            outPosition.y = this.game.height;
        }
        else if (this.direction == Push.DIRECTION.RIGHT_BOTTOM) {
            inPosition.x = -this.game.width;
            outPosition.x = this.game.width;
            inPosition.y = -this.game.height;
            outPosition.y = this.game.height;
        }
        else if (this.direction == Push.DIRECTION.RIGHT) {
            inPosition.x = -this.game.width;
            outPosition.x = this.game.width;
        }
        else if (this.direction == Push.DIRECTION.RIGHT_TOP) {
            inPosition.x = -this.game.width;
            outPosition.x = this.game.width;
            inPosition.y = this.game.height;
            outPosition.y = -this.game.height;
        }
        else if (this.direction == Push.DIRECTION.TOP) {
            inPosition.y = this.game.height;
            outPosition.y = -this.game.height;
        }
        else if (this.direction == Push.DIRECTION.LEFT_TOP) {
            inPosition.x = this.game.width;
            outPosition.x = -this.game.width;
            inPosition.y = this.game.height;
            outPosition.y = -this.game.height;
        }
        return position;
    };
    Push.prototype.complete = function () {
        this.game.tweens.remove(this.tweenIn);
        this.game.tweens.remove(this.tweenOut);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Push;
}(base_1.default));
Push.DIRECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    LEFT_TOP: 'LEFT_TOP',
    RIGHT_TOP: 'RIGHT_TOP',
    LEFT_BOTTOM: 'LEFT_BOTTOM',
    RIGHT_BOTTOM: 'RIGHT_BOTTOM',
};
exports.default = Push;

},{"./base":2}],14:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Shape = (function (_super) {
    __extends(Shape, _super);
    function Shape(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.shape = _this.get(data, 'shape', Shape.SHAPE.CIRCLE);
        return _this;
    }
    Shape.prototype.run = function () {
        var w = this.game.width;
        var h = this.game.height;
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        var mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xFFFFFF);
        mask.anchor.setTo(0.5, 0.5);
        mask.x = w / 2;
        mask.y = h / 2;
        this.inView.mask = mask;
        if (this.shape == Shape.SHAPE.CIRCLE) {
            mask.drawCircle(0, 0, Math.sqrt(w * w + h * h));
        }
        else if (this.shape == Shape.SHAPE.DIAMOND) {
            mask.drawPolygon({ x: -w * 2, y: 0 }, { x: 0, y: h * 2 }, { x: w * 2, y: 0 }, { x: 0, y: -h * 2 });
        }
        else if (this.shape == Shape.SHAPE.PLUS) {
            mask.drawRect(-w / 2, -3 * h / 2, w, 3 * h);
            mask.drawRect(-3 * w / 2, -h / 2, 3 * w, h);
        }
        var tween = this.game.add.tween(this.inView.mask.scale);
        tween.from({ x: 0, y: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.addOnce(this.complete, this);
        this.tween = tween;
    };
    Shape.prototype.complete = function () {
        this.inView.mask.destroy();
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Shape;
}(base_1.default));
Shape.SHAPE = {
    CIRCLE: 'CIRCLE',
    DIAMOND: 'DIAMOND',
    PLUS: 'PLUS',
};
exports.default = Shape;

},{"./base":2}],15:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Shrink = (function (_super) {
    __extends(Shrink, _super);
    function Shrink(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.direction = _this.get(data, 'direction', Shrink.DIRECTION.TOP_BOTTOM);
        return _this;
    }
    Shrink.prototype.run = function () {
        this.game.world.add(this.inView);
        this.game.world.add(this.outView);
        this.outView.mask = this.createMask();
        this.tween = this.createTween();
        this.tween.onComplete.addOnce(this.complete, this);
        ;
    };
    Shrink.prototype.createMask = function () {
        var w = this.game.width;
        var h = this.game.height;
        var mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xFFFFFF);
        mask.anchor.setTo(0.5, 0.5);
        mask.x = this.game.width / 2;
        mask.y = this.game.height / 2;
        mask.drawRect(-mask.x, -mask.y, this.game.width, this.game.height);
        return mask;
    };
    Shrink.prototype.createTween = function () {
        var tween;
        if (this.direction == Shrink.DIRECTION.TOP_BOTTOM) {
            tween = this.game.add.tween(this.outView.mask.scale);
            tween.to({ y: 0 }, 1000, Phaser.Easing.Linear.None, true);
        }
        else if (this.direction == Shrink.DIRECTION.LEFT_RIGHT) {
            tween = this.game.add.tween(this.outView.mask.scale);
            tween.to({ x: 0 }, 1000, Phaser.Easing.Linear.None, true);
        }
        return tween;
    };
    Shrink.prototype.complete = function () {
        this.outView.mask.destroy();
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Shrink;
}(base_1.default));
Shrink.DIRECTION = {
    TOP_BOTTOM: 'TOP_BOTTOM',
    LEFT_RIGHT: 'LEFT_RIGHT',
    LEFT_TOP: "LEFT_TOP",
    LEFT_BOTTOM: "LEFT_BOTTOM",
    RIGHT_TOP: "RIGHT_TOP",
    RIGHT_BOTTOM: "RIGHT_BOTTOM",
};
exports.default = Shrink;

},{"./base":2}],16:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Shutter = (function (_super) {
    __extends(Shutter, _super);
    function Shutter(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.direction = _this.get(data, 'direction', Shutter.DIRECTION.HORIZONTAL);
        _this.lineWidth = 64;
        return _this;
    }
    Shutter.prototype.run = function () {
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
            };
            processEnd = {
                barWidth: this.lineWidth,
            };
        }
        else if (this.direction === Shutter.DIRECTION.HORIZONTAL) {
            processStart = {
                set lineWidth(lineWidth) {
                    that.fillLine(lineWidth);
                },
                get lineWidth() {
                    return 0;
                }
            };
            processEnd = {
                lineWidth: this.lineWidth,
            };
        }
        var tween = this.game.add.tween(processStart);
        tween.to(processEnd, 1000, Phaser.Easing.Linear.None, true);
        tween.onStart.addOnce(this.onStartHandle, this);
        tween.onComplete.addOnce(this.complete, this);
        this.tween = tween;
    };
    Shutter.prototype.onStartHandle = function () {
        this.inView.mask = this.mask;
        this.inView.visible = true;
    };
    Shutter.prototype.fillLine = function (lineWidth) {
        var w = this.game.width / this.inView.scale.x;
        for (var x = 0; x < w; x += this.lineWidth) {
            this.mask.drawRect(x, 0, lineWidth, this.game.height);
        }
    };
    Shutter.prototype.fillBar = function (barWidth) {
        var h = this.game.height / this.inView.scale.y;
        for (var x = 0; x < h; x += this.lineWidth) {
            this.mask.drawRect(0, x, this.game.width, barWidth);
        }
    };
    Shutter.prototype.complete = function () {
        this.mask.destroy();
        this.inView.mask = null;
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Shutter;
}(base_1.default));
Shutter.DIRECTION = {
    HORIZONTAL: 'HORIZONTAL',
    VERTICAL: 'VERTICAL',
};
exports.default = Shutter;

},{"./base":2}],17:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Spread = (function (_super) {
    __extends(Spread, _super);
    function Spread(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.direction = _this.get(data, 'direction', Spread.DIRECTION.TOP_BOTTOM);
        return _this;
    }
    Spread.prototype.run = function () {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        this.inView.mask = this.createMask();
        this.tween = this.createTween();
        this.tween.onComplete.addOnce(this.complete, this);
        ;
    };
    Spread.prototype.createMask = function () {
        var w = this.game.width;
        var h = this.game.height;
        var divideCount = 16;
        var divideX = w / divideCount;
        var divideY = h / divideCount;
        var mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xFFFFFF);
        if (this.direction == Spread.DIRECTION.TOP_BOTTOM || this.direction == Spread.DIRECTION.LEFT_RIGHT) {
            mask.anchor.setTo(0.5, 0.5);
            mask.x = this.game.width / 2;
            mask.y = this.game.height / 2;
            mask.drawRect(-mask.x, -mask.y, this.game.width, this.game.height);
        }
        else if (this.direction == Spread.DIRECTION.LEFT_TOP) {
            for (var i = 0; i < divideCount; i++) {
                mask.drawRect(2 * w - divideX * i, divideY * i, this.game.width + divideX * i, divideY);
            }
        }
        else if (this.direction == Spread.DIRECTION.RIGHT_BOTTOM) {
            for (var i = 0; i < divideCount; i++) {
                mask.drawRect(-2 * w, divideY * i, this.game.width + divideX * (divideCount - i), divideY);
            }
        }
        else if (this.direction == Spread.DIRECTION.RIGHT_TOP) {
            for (var i = 0; i < divideCount; i++) {
                mask.drawRect(-2 * w, divideY * i, this.game.width + divideX * i, divideY);
            }
        }
        else if (this.direction == Spread.DIRECTION.LEFT_BOTTOM) {
            for (var i = 0; i < divideCount; i++) {
                mask.drawRect(w + divideX * i, divideY * i, 2 * this.game.width - divideX * i, divideY);
            }
        }
        return mask;
    };
    Spread.prototype.createTween = function () {
        var tween;
        if (this.direction == Spread.DIRECTION.TOP_BOTTOM) {
            tween = this.game.add.tween(this.inView.mask.scale);
            tween.from({ y: 0 }, 1000, Phaser.Easing.Linear.None, true);
        }
        else if (this.direction == Spread.DIRECTION.LEFT_RIGHT) {
            tween = this.game.add.tween(this.inView.mask.scale);
            tween.from({ x: 0 }, 1000, Phaser.Easing.Linear.None, true);
        }
        else if (this.direction == Spread.DIRECTION.LEFT_TOP || this.direction == Spread.DIRECTION.LEFT_BOTTOM) {
            tween = this.game.add.tween(this.inView.mask);
            tween.to({ x: -2 * this.game.width }, 1000, Phaser.Easing.Linear.None, true);
        }
        else if (this.direction == Spread.DIRECTION.RIGHT_BOTTOM || this.direction == Spread.DIRECTION.RIGHT_TOP) {
            tween = this.game.add.tween(this.inView.mask);
            tween.to({ x: 2 * this.game.width }, 1000, Phaser.Easing.Linear.None, true);
        }
        return tween;
    };
    Spread.prototype.complete = function () {
        this.inView.mask.destroy();
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Spread;
}(base_1.default));
Spread.DIRECTION = {
    TOP_BOTTOM: 'TOP_BOTTOM',
    LEFT_RIGHT: 'LEFT_RIGHT',
    LEFT_TOP: "LEFT_TOP",
    LEFT_BOTTOM: "LEFT_BOTTOM",
    RIGHT_TOP: "RIGHT_TOP",
    RIGHT_BOTTOM: "RIGHT_BOTTOM",
};
exports.default = Spread;

},{"./base":2}],18:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Uncover = (function (_super) {
    __extends(Uncover, _super);
    function Uncover(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.direction = _this.get(data, 'direction', Uncover.DIRECTION.LEFT);
        return _this;
    }
    Uncover.prototype.run = function () {
        this.game.world.add(this.inView);
        this.game.world.add(this.outView);
        var tween = this.game.add.tween(this.outView);
        var position = this.calculatePosition();
        tween.to(position, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.addOnce(this.complete, this);
        this.tween = tween;
    };
    Uncover.prototype.calculatePosition = function () {
        var position = {
            x: this.outView.x,
            y: this.outView.y,
        };
        if (this.direction == Uncover.DIRECTION.LEFT) {
            position.x = -this.game.width;
        }
        else if (this.direction == Uncover.DIRECTION.LEFT_BOTTOM) {
            position.x = -this.game.width;
            position.y = this.game.height;
        }
        else if (this.direction == Uncover.DIRECTION.BOTTOM) {
            position.y = this.game.height;
        }
        else if (this.direction == Uncover.DIRECTION.RIGHT_BOTTOM) {
            position.x = this.game.width;
            position.y = this.game.height;
        }
        else if (this.direction == Uncover.DIRECTION.RIGHT) {
            position.x = this.game.width;
        }
        else if (this.direction == Uncover.DIRECTION.RIGHT_TOP) {
            position.x = this.game.width;
            position.y = -this.game.height;
        }
        else if (this.direction == Uncover.DIRECTION.TOP) {
            position.y = -this.game.height;
        }
        else if (this.direction == Uncover.DIRECTION.LEFT_TOP) {
            position.x = -this.game.width;
            position.y = -this.game.height;
        }
        return position;
    };
    Uncover.prototype.complete = function () {
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.inView);
        this.game.world.remove(this.outView);
        _super.prototype.complete.call(this);
    };
    return Uncover;
}(base_1.default));
Uncover.DIRECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    LEFT_TOP: 'LEFT_TOP',
    RIGHT_TOP: 'RIGHT_TOP',
    LEFT_BOTTOM: 'LEFT_BOTTOM',
    RIGHT_BOTTOM: 'RIGHT_BOTTOM',
};
exports.default = Uncover;

},{"./base":2}],19:[function(require,module,exports){
/// <reference path='../definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var Wipe = (function (_super) {
    __extends(Wipe, _super);
    function Wipe(game, outView, inView, data) {
        var _this = _super.call(this, game, outView, inView) || this;
        _this.direction = _this.get(data, 'direction', Wipe.DIRECTION.LEFT);
        return _this;
    }
    Wipe.prototype.run = function () {
        this.game.world.add(this.outView);
        this.game.world.add(this.inView);
        var mask = this.createMask();
        this.inView.mask = mask;
        var tween = this.game.add.tween(this.inView.mask.scale);
        if (this.direction == Wipe.DIRECTION.TOP || this.direction == Wipe.DIRECTION.BOTTOM) {
            tween.from({ y: 0 }, 1000, Phaser.Easing.Linear.None, true);
        }
        else if (this.direction == Wipe.DIRECTION.LEFT || this.direction == Wipe.DIRECTION.RIGHT) {
            tween.from({ x: 0 }, 1000, Phaser.Easing.Linear.None, true);
        }
        else {
            tween.from({ x: 0, y: 0 }, 1000, Phaser.Easing.Linear.None, true);
        }
        tween.onComplete.addOnce(this.complete, this);
        this.tween = tween;
    };
    Wipe.prototype.createMask = function () {
        var mask;
        if (this.direction == Wipe.DIRECTION.TOP) {
            mask = this.game.add.graphics(0, this.game.height);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, -this.game.height, this.game.width, this.game.height);
        }
        else if (this.direction == Wipe.DIRECTION.BOTTOM) {
            mask = this.game.add.graphics(0, 0);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, 0, this.game.width, this.game.height);
        }
        else if (this.direction == Wipe.DIRECTION.LEFT) {
            mask = this.game.add.graphics(this.game.width, 0);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(-this.game.width, 0, this.game.width, this.game.height);
        }
        else if (this.direction == Wipe.DIRECTION.RIGHT) {
            mask = this.game.add.graphics(0, 0);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, 0, this.game.width, this.game.height);
        }
        else if (this.direction == Wipe.DIRECTION.LEFT_TOP) {
            mask = this.game.add.graphics(this.game.width, this.game.height);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(-this.game.width, -this.game.height, this.game.width, this.game.height);
        }
        else if (this.direction == Wipe.DIRECTION.LEFT_BOTTOM) {
            mask = this.game.add.graphics(this.game.width, 0);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(-this.game.width, 0, this.game.width, this.game.height);
        }
        else if (this.direction == Wipe.DIRECTION.RIGHT_TOP) {
            mask = this.game.add.graphics(0, this.game.height);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, -this.game.height, this.game.width, this.game.height);
        }
        else if (this.direction == Wipe.DIRECTION.RIGHT_BOTTOM) {
            mask = this.game.add.graphics(0, 0);
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, 0, this.game.width, this.game.height);
        }
        return mask;
    };
    Wipe.prototype.complete = function () {
        this.inView.mask.destroy();
        this.game.tweens.remove(this.tween);
        this.game.world.remove(this.outView);
        this.game.world.remove(this.inView);
        _super.prototype.complete.call(this);
    };
    return Wipe;
}(base_1.default));
Wipe.DIRECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
    LEFT_TOP: 'LEFT_TOP',
    RIGHT_TOP: 'RIGHT_TOP',
    LEFT_BOTTOM: 'LEFT_BOTTOM',
    RIGHT_BOTTOM: 'RIGHT_BOTTOM',
};
exports.default = Wipe;

},{"./base":2}],20:[function(require,module,exports){
/// <reference path='./definitions.d.ts'/>
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var View = (function (_super) {
    __extends(View, _super);
    function View(game, x, y) {
        var _this = this;
        var graphics = new Phaser.Graphics(game, 0, 0);
        // 黑色背景
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0, 0, game.width, game.height);
        graphics.endFill();
        var texture = new Phaser.RenderTexture(game, game.width, game.height);
        texture.renderXY(graphics, game.camera.position.x * -1, game.camera.position.y * -1);
        texture.renderXY(game.world, game.camera.position.x * -1, game.camera.position.y * -1);
        _this = _super.call(this, game, x || 0, y || 0, texture) || this;
        return _this;
    }
    return View;
}(Phaser.Image));
exports.default = View;

},{}]},{},[1]);
