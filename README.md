State Transition Plugin for Phaser
=======================
场景切换通常用于两个不同的界面之间，尤其是在移动端的设备上，因为屏幕尺寸和交互方式的特性，就更多的会出现这些切换的操作，而很突然地从一个界面切换到另一个界面会给用户带来困扰，所以在触发这些操作的同时，往往需要过渡形式的动画来引导用户是如何从一个界面切换到另一个界面的。

这个插件就是解决 Phaser 框架中，2个 State 之间的切换的过渡动画。
参考以下插件

[phaser-state-transition](https://github.com/cristianbote/phaser-state-transition)

[phaser-state-transition-plugin](https://github.com/aaccurso/phaser-state-transition-plugin)

## Example
[演示](https://codepen.io/lazyboywu/full/brqLbj)

## 如何使用

在页面中引入 js

```javascript
<script src="path/to/phaser-plugin-state-transition.js"></script>
```
添加 Phaser 插件
```javascript
game.plugins.add(StateTransition.Manager);
```

启用过渡动画
```javascript
game.stateTransition.start('stateKey', transitionData);
```

其中 transitionData 可是以下格式

```javascript
{
    type: 'cover',
    direction: StateTransition.Transition.Cover.DIRECTION.LEFT,
}
```
