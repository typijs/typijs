import Quill from 'quill'

// configure Quill to use inline styles so the email's format properly
const DirectionAttribute = Quill.import('attributors/attribute/direction');
Quill.register(DirectionAttribute, true);

const AlignClass = Quill.import('attributors/class/align');
Quill.register(AlignClass, true);

const BackgroundClass = Quill.import('attributors/class/background');
Quill.register(BackgroundClass, true);

const ColorClass = Quill.import('attributors/class/color');
Quill.register(ColorClass, true);

const DirectionClass = Quill.import('attributors/class/direction');
Quill.register(DirectionClass, true);

const FontClass = Quill.import('attributors/class/font');
Quill.register(FontClass, true);

const SizeClass = Quill.import('attributors/class/size');
Quill.register(SizeClass, true);

const AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle, true);

const BackgroundStyle = Quill.import('attributors/style/background');
Quill.register(BackgroundStyle, true);

const ColorStyle = Quill.import('attributors/style/color');
Quill.register(ColorStyle, true);

const DirectionStyle = Quill.import('attributors/style/direction');
Quill.register(DirectionStyle, true);

const FontStyle = Quill.import('attributors/style/font');
Quill.register(FontStyle, true);

const SizeStyle = Quill.import('attributors/style/size');
Quill.register(SizeStyle, true);