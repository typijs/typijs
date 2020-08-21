// https://base64.guru/developers/javascript/examples/polyfill
// A helper that returns Base64 characters and their indices.
const chars = {
    ascii(): string {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    },
    indices(): any {
        if (!this.cache) {
            this.cache = {};
            const ascii = chars.ascii();

            for (let c = 0; c < ascii.length; c++) {
                const chr = ascii[c];
                this.cache[chr] = c;
            }
        }
        return this.cache;
    }
};

// encode base 64
export function btoa(data: string): string {
    const ascii = chars.ascii();
    const len = data.length - 1;
    let i = -1;
    let b64 = '';

    while (i < len) {
        // tslint:disable-next-line: no-bitwise
        const code = data.charCodeAt(++i) << 16 | data.charCodeAt(++i) << 8 | data.charCodeAt(++i);
        // tslint:disable-next-line: no-bitwise
        b64 += ascii[(code >>> 18) & 63] + ascii[(code >>> 12) & 63] + ascii[(code >>> 6) & 63] + ascii[code & 63];
    }

    const pads = data.length % 3;
    if (pads > 0) {
        b64 = b64.slice(0, pads - 3);

        while (b64.length % 4 !== 0) {
            b64 += '=';
        }
    }

    return b64;
}

// decode base 64
export function atob(b64: string): string {
    let indices = chars.indices(),
        pos = b64.indexOf('='),
        padded = pos > -1,
        len = padded ? pos : b64.length,
        i = -1,
        data = '';

    while (i < len) {
        // tslint:disable-next-line: no-bitwise
        const code = indices[b64[++i]] << 18 | indices[b64[++i]] << 12 | indices[b64[++i]] << 6 | indices[b64[++i]];
        if (code !== 0) {
            // tslint:disable-next-line: no-bitwise
            data += String.fromCharCode((code >>> 16) & 255, (code >>> 8) & 255, code & 255);
        }
    }

    if (padded) {
        data = data.slice(0, pos - b64.length);
    }

    return data;
}
