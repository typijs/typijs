import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptJsService {
    constructor(private rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) { }

    loadScript(scriptPath: string) {
        const renderer = this.rendererFactory.createRenderer(null, null);
        const existedScript = this.document.getElementById('secondary-js');
        if (existedScript) {
            renderer.removeChild(this.document.body, existedScript);
        }
        const script = renderer.createElement('script');
        script.id = 'secondary-js';
        script.type = 'text/javascript';
        script.src = scriptPath;
        renderer.appendChild(this.document.body, script);
    }
}
