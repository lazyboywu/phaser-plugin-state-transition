/// <reference path='../definitions.d.ts'/>

import * as _ from 'lodash';

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
    create(game: Phaser.Game, outView: View, inView: View, data: object) {
        // 没有包含类型
        if (!data || !_.has(data, 'type')) {
            return null;
        }

        let type = _.get(data, 'type', '');

        if (!_.has(this.creators, type)) {
            console.log('Phaser Plugin Transition Factory: create ' + type + ' not found', type);
            return null;
        }

        return new this.creators[type](game, outView, inView, data);
    }
}
