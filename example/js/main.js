/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts"/>

var width = 800;
var height = 600;
// 创建游戏主对象
var game = new Phaser.Game(width, height, Phaser.AUTO, 'container');

var transitionFunc = 'cover';
var transitionData = {direction: 'left'};

var StateTransition = window.StateTransition;

var outState = {
    preload: function () {
        game.load.image('out-view', 'assets/out-view.jpg');
        game.load.image('in-view', 'assets/in-view.jpg');
    },

    create: function () {
        var outView = game.add.image(0, 0, 'out-view');
        outView.scale.setTo(height / outView.getLocalBounds().height);
    },
};

var inState = {
    preload: function () {
    },

    create: function () {
        var inView = game.add.image(0, 0, 'in-view');
        inView.scale.setTo(height / inView.getLocalBounds().height);
    },
}

game.state.add('out', outState);
game.state.add('in', inState);

window.onload = function() {
    game.plugins.add(StateTransition.Manager);
    var config = {
        type: ''
    };
    var gui = new dat.GUI({
        closeOnTop: false,
        width: 300,
    });

    gui.add(config, 'type', {
        '选择': '',
        '无': 'none',
        '覆盖': 'cover',
        '揭开': 'uncover',
        '时钟': 'clock',
    })
    .onFinishChange(function(type) {
        createGUI(gui, type);
    });
}

var tmpGUI = null;
function createGUI(gui, type) {

    for (var i = 0; i < gui.__controllers.length; i++) {
        var controller = gui.__controllers[i];
        if (controller.property && controller.property !== 'type') {
            gui.remove(controller);
        }
    }
    controller = null;

    if (type === 'none') {
        changeState();
    } else if (type === 'cover') {
        var config = {
            'direction': '',
        }
        gui.add(config, 'direction', {
            '上(TOP)': StateTransition.Transition.Cover.DIRECTION.TOP,
            '下(BOTTOM)': StateTransition.Transition.Cover.DIRECTION.BOTTOM,
            '左(LEFT)': StateTransition.Transition.Cover.DIRECTION.LEFT,
            '右(RIGHT)': StateTransition.Transition.Cover.DIRECTION.RIGHT,
            '左上(LEFT_TOP)': StateTransition.Transition.Cover.DIRECTION.LEFT_TOP,
            '左下(LEFT_BOTTOM)': StateTransition.Transition.Cover.DIRECTION.LEFT_BOTTOM,
            '右上(RIGHT_TOP)': StateTransition.Transition.Cover.DIRECTION.RIGHT_TOP,
            '右下(RIGHT_BOTTOM)': StateTransition.Transition.Cover.DIRECTION.RIGHT_BOTTOM,
        })
        .onFinishChange(function(direction) {
            changeStateByTransition({
                type: 'cover',
                direction: direction,
            });
        });

    } else if (type === 'uncover') {
        var config = {
            'direction': '',
        }
        gui.add(config, 'direction', {
            '上(TOP)': StateTransition.Transition.Uncover.DIRECTION.TOP,
            '下(BOTTOM)': StateTransition.Transition.Uncover.DIRECTION.BOTTOM,
            '左(LEFT)': StateTransition.Transition.Uncover.DIRECTION.LEFT,
            '右(RIGHT)': StateTransition.Transition.Uncover.DIRECTION.RIGHT,
            '左上(LEFT_TOP)': StateTransition.Transition.Uncover.DIRECTION.LEFT_TOP,
            '左下(LEFT_BOTTOM)': StateTransition.Transition.Uncover.DIRECTION.LEFT_BOTTOM,
            '右上(RIGHT_TOP)': StateTransition.Transition.Uncover.DIRECTION.RIGHT_TOP,
            '右下(RIGHT_BOTTOM)': StateTransition.Transition.Uncover.DIRECTION.RIGHT_BOTTOM,
        })
        .onFinishChange(function(direction) {
            changeStateByTransition({
                type: 'uncover',
                direction: direction,
            });
        });

    } else if (type === 'clock') {
        changeStateByTransition({
            type: 'clock',
        });
    }
}

function changeState() {
    game.state.start('out');
    setTimeout(function() {
        game.state.start('in');
    }, 1000);
}

function changeStateByTransition(transitionData) {
    game.state.start('out');
    setTimeout(function() {
        game.stateTransition.start('in', transitionData);
    }, 1000);
}



