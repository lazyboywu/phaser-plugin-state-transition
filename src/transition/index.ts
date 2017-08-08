import Base from './base';

import Clock from './clock';
import Cover from './cover';
import Dissolve from './dissolve';
import Fade from './fade';
import Line from './line';
import Push from './push';
import Shape from './shape';
import Uncover from './uncover';
import Wipe from './wipe';

import Factory from './factory';

let factory = new Factory();
factory.add('clock', Clock);
factory.add('cover', Cover);
factory.add('dissolve', Dissolve);
factory.add('fade', Fade);
factory.add('line', Line);
factory.add('push', Push);
factory.add('shape', Shape);
factory.add('uncover', Uncover);
factory.add('wipe', Wipe);

export default {
    Base,
    factory,

    Clock,
    Cover,
    Dissolve,
    Fade,
    Line,
    Push,
    Shape,
    Uncover,
    Wipe,
}
