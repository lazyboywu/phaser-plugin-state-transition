/// <reference path='../definitions.d.ts'/>

import View from '../view';

import Base from './base';

interface Creator<T> {
    new(game: Phaser.Game, outView: View, inView: View, data?: object): T;
}

export default class Factory {

    creators: {[x:string]: Creator<Base>} = {};

    add(type: string, creator: Creator<Base>) {
        this.creators[type] = creator;
    }

    /**
     *
     * @param {Phaser.Game} game
     * @return {Base}
     */
    create(game: Phaser.Game, outView: View, inView: View, data: {[key:string]:any}) {
        // 没有包含类型
        if (!data || !Object.prototype.hasOwnProperty.call(data, 'type')) {
            console.error('Phaser Plugin Transition Factory: can not find type property ');
            return null;
        }

        let type = data.type;

        if (!Object.prototype.hasOwnProperty.call(this.creators, type)) {
            console.error('Phaser Plugin Transition Factory: create ' + type + ' not found', type);
            return null;
        }

        return new this.creators[type](game, outView, inView, data);
    }
}
