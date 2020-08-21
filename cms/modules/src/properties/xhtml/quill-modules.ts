import Quill from 'quill';

import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

function $create(elName) {
    return document.createElement(elName);
}
function $setAttr(el, key, value) {
    return el.setAttribute(key, value);
}

export class ClickMeButton {
    constructor(quill, options) {
        const toolbarModule = quill.getModule('toolbar');
        const toolbarEl = toolbarModule.container;
        const buttonContainer = $create('span');
        $setAttr(buttonContainer, 'class', 'ql-formats');
        const span = $create('span');
        span.innerHTML = 'Click Me';
        span.title = 'Try click me';
        if (options.handler) {
            span.onclick = options.handler;
        }

        buttonContainer.appendChild(span);
        toolbarEl.appendChild(buttonContainer);
    }
}

Quill.register('modules/clickMeButton', ClickMeButton);
