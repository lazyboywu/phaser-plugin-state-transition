import Base from './base';

import Clock from './clock';
import Cover from './cover';
import Uncover from './uncover';

import Factory from './factory';

let factory = new Factory();
factory.add('clock', Clock);
factory.add('cover', Cover);
factory.add('uncover', Uncover);

export default  {
    Base,
    factory,

    Clock,
    Cover,
    Uncover,
}
