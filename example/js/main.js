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
    },

    create: function () {
        var outView = game.add.image(0, 0, 'out-view');
        outView.scale.setTo(height / outView.getLocalBounds().height);
    },
};

var inState = {
    preload: function () {
        game.load.image('in-view', 'assets/in-view.jpg');
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
        closeOnTop: false
    });

    gui.add(config, 'type', {'选择': '', '无': 'none', '覆盖':'cover', '揭开': 'uncover'})
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
            '左': StateTransition.Transition.Cover.DIRECTION.LEFT,
            '右': StateTransition.Transition.Cover.DIRECTION.RIGHT,
        })
        .onFinishChange(function(direction) {
            changeStateByTransition({
                type: 'cover',
                direction: direction,
            });
        });

    } else if (type === 'uncover') {
        var config = {
            'direction': 'LEFT',
        }
        gui.add(config, 'direction', {
            '左': StateTransition.Transition.Uncover.DIRECTION.LEFT,
            '右': StateTransition.Transition.Uncover.DIRECTION.RIGHT,
        })
        .onFinishChange(function(direction) {
            transitionFunc = 'uncover';
            transitionParams = direction;
            game.state.start('main');
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



