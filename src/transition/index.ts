import Base from './base';

import Clock from './clock';
import Cover from './cover';

import Factory from './factory';

let factory = new Factory();
factory.add('clock', Clock);
factory.add('cover', Cover);

export default  {
    Base,
    factory,

    Clock,
    Cover,
}
