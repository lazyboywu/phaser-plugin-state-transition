/// <reference path='./definitions.d.ts'/>

export default class View extends Phaser.Image {

    // 修复 phaser.d.ts 的提示错误
    mask: Phaser.Graphics;

    constructor(game: Phaser.Game, x?: number, y?: number) {

        let graphics = new Phaser.Graphics(game, 0, 0);
        // 黑色背景
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0, 0, game.width, game.height);
        graphics.endFill();

        let texture = new Phaser.RenderTexture(game, game.width, game.height);
        texture.renderXY(graphics, game.camera.position.x * -1, game.camera.position.y * -1);
        texture.renderXY(game.world, game.camera.position.x * -1, game.camera.position.y * -1);

        super(game, x || 0, y || 0, texture);
    }
}
