export const decrypt = async (data: string, key: JSON, iv: string) => {
    const _iv = new Uint8Array(12);
    for (let i = 0; i < iv.length; i += 2) {
        _iv[i / 2] = parseInt(iv.substr(i, 2), 16);
    }
    const _key = await window.crypto.subtle
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        .importKey("jwk", key.key, { name: "AES-GCM", length: 256 }, true, [
            "encrypt",
            "decrypt",
        ])
    console.log(1)
    const _data = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: _iv,
        },
        _key,
        base64ToArrayBuffer(data)
    )
    const decoder = new TextDecoder()
    const _u_data = decoder.decode(_data).toString()
    return _u_data
};
export function toArrayBuffer(buffer: Buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
}
export function base64ToArrayBuffer(base64String: string) {
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const arrayBuffer = new ArrayBuffer(length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    return arrayBuffer;
}
