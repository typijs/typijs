import Quill from 'quill';

const directionAttribute = Quill.import('attributors/attribute/direction');
Quill.register(directionAttribute, true);

const alignClass = Quill.import('attributors/class/align');
Quill.register(alignClass, true);

const backgroundClass = Quill.import('attributors/class/background');
Quill.register(backgroundClass, true);

const colorClass = Quill.import('attributors/class/color');
Quill.register(colorClass, true);

const directionClass = Quill.import('attributors/class/direction');
Quill.register(directionClass, true);

const fontClass = Quill.import('attributors/class/font');
Quill.register(fontClass, true);

const sizeClass = Quill.import('attributors/class/size');
Quill.register(sizeClass, true);

const alignStyle = Quill.import('attributors/style/align');
Quill.register(alignStyle, true);

const backgroundStyle = Quill.import('attributors/style/background');
Quill.register(backgroundStyle, true);

const colorStyle = Quill.import('attributors/style/color');
Quill.register(colorStyle, true);

const directionStyle = Quill.import('attributors/style/direction');
Quill.register(directionStyle, true);

const fontStyle = Quill.import('attributors/style/font');
Quill.register(fontStyle, true);

const sizeStyle = Quill.import('attributors/style/size');
Quill.register(sizeStyle, true);
