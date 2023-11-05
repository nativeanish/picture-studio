import * as B64js from "base64-js";


function stringToBuffer(string: string): Uint8Array {
    return new TextEncoder().encode(string);
}

export function stringToB64Url(string: string): string {
    return bufferTob64Url(stringToBuffer(string));
}

function bufferTob64(buffer: Uint8Array): string {
    return B64js.fromByteArray(new Uint8Array(buffer));
}

function bufferTob64Url(buffer: Uint8Array): string {
    return b64UrlEncode(bufferTob64(buffer));
}

function b64UrlEncode(b64UrlString: string): string {
    return b64UrlString
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        // eslint-disable-next-line no-useless-escape
        .replace(/\=/g, "");
}
