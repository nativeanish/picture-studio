import axios from "axios";
import useAddress from "../stores/useAddress";
import useAlert from "../stores/useAlert";
import useUserData from "../stores/useUserData";
import useVideo from "../stores/useVideo";
import {
    getCommercial,
    getDerivation,
    isCommericalType,
    isDerivationType,
} from "./getComandDer";
import get_contract from "./getWarp";
import { upload_irys } from "./upload_irys";
import useLoader from "../stores/useLoader";
export function upload_video() {
    const setOpen = useAlert.getState().setOpen;
    const setDescription = useAlert.getState().setDescription;
    const _setOpen = useLoader.getState().setOpen

    _upload_video().then().catch((err) => {
        _setOpen(false);
        setDescription([]);
        setDescription([`There is error: ${err}`])
        setOpen(true)
    })
}
async function _upload_video() {
    const _video = useVideo.getState();
    const title = _video.title;
    const description = _video.description;
    const tags = _video.tags;
    const thumbnail = _video.thumbnail;
    const setOpen = useAlert.getState().setOpen;
    const setDescription = useAlert.getState().setDescription;
    const video = _video.unecrypted_video;
    const address = useAddress.getState().address
        ? useAddress.getState().address : ""
    const _tags: Array<{ name: string, value: string }> = []
    const price = _video.price
    const accesss = _video.access;
    const commerical = _video.commerical;
    const derivation = _video.derivation;
    const _thumbnail_tags: Array<{ name: string, value: string }> = []
    const playlist = _video.selected_playlist;
    const _setDescription = useLoader.getState().setDescription
    const _setOpen = useLoader.getState().setOpen
    if (
        title.length &&
        description.length &&
        tags.length &&
        thumbnail.length &&
        video?.length
    ) {
        const contract = await get_contract()
        _tags.push({ name: "Title", value: title })
        _tags.push({ name: "Content-Type", value: "base64" })
        _tags.push({ name: "Description", value: description })
        _tags.push({ name: "Tags", value: JSON.stringify(tags) })
        _thumbnail_tags.push({ name: "Title", value: title })
        _thumbnail_tags.push({ name: "Content-Type", value: "base64" });
        _thumbnail_tags.push({ name: "Description", value: description });
        _thumbnail_tags.push({ name: "Tags", value: JSON.stringify(tags) })
        if (playlist === "none") {
            _tags.push({ name: "Playlist-Id", value: "None" })
            _tags.push({ name: "License", value: "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8" });
            if (isCommericalType(commerical)) {
                _tags.push({ name: "Commerical-Use", value: getCommercial(commerical) })
                if (isDerivationType(derivation)) {
                    _tags.push({ name: "Derivation", value: getDerivation(derivation) })
                    if (accesss === "exclusive") {
                        _tags.push({ name: "Access-Model", value: accesss })
                        if (!isNaN(parseFloat(price))) {
                            _tags.push({ name: "License-Fee", value: String(parseFloat(price) * 1000000000000) });
                            _tags.push({ name: "Currency", value: "Arweave" });
                            _tags.push({ name: "Payment-Address", value: address?.length ? address : "" });
                            _setDescription("Uploading thumbnails to irys")
                            _setOpen(true)
                            const thumbnail_id = await upload_irys(thumbnail, "playlist", _thumbnail_tags)
                            if (thumbnail_id?.length) {
                                _tags.push({ name: "Thumbnail", value: thumbnail_id })
                                _setDescription("Encrypting the video")
                                const crypto = await encrypt(video);
                                _setDescription("Uploading encrypted video to irys")
                                const e_video = await upload_irys(arrayBufferToBase64(crypto.data), "video", _tags)
                                if (e_video?.length) {
                                    _setDescription("Writing to Contract")
                                    const res = await contract.writeInteraction({ function: "upload_video", title, id: e_video, description, tags, thumbnails: thumbnail_id, access_model: accesss, price_winston: String(parseFloat(price) * 1000000000000) })
                                    // if (res?.bundlrResponse?.id) {
                                    console.log(res)
                                    console.log(crypto.iv)
                                    console.log(crypto.key)
                                    const iv_string = Buffer.from(crypto.iv).toString('hex')
                                    const hash = await generateSHA256Hash(`${e_video}${JSON.stringify(crypto.key)}${iv_string}`)
                                    _setDescription("Encrypting the keys")
                                    const upload = await axios.post("http://localhost:8080/upload", {
                                        hash: hash, content_id: e_video, key: crypto.key, iv: iv_string
                                    })
                                    if (upload.status === 200) {
                                        _setOpen(false)
                                    }
                                    // } else {
                                    //     _setOpen(false)
                                    //     setDescription([])
                                    //     setDescription(["Error in write interaction is warp contracts"]);
                                    //     setOpen(true);
                                    // }
                                }
                            } else {
                                _setOpen(false)
                                setDescription([])
                                setDescription(["Error in upload thumnails"]);
                                setOpen(true);
                            }
                        } else {
                            _setOpen(false)
                            setDescription([])
                            setDescription(["Price should be greater than 0"]);
                            setOpen(true);
                        }
                    } else if (accesss === "open") {
                        _tags.push({ name: "Access-Model", value: "open" })
                        _setOpen(true)
                        _setDescription("Uploading thumbnails to irys")
                        const thumbnail_id = await upload_irys(thumbnail, "playlist", _thumbnail_tags)
                        if (thumbnail_id?.length) {
                            _tags.push({ name: "Thumbnail", value: thumbnail_id })
                            _setDescription("Uploading video to irys")
                            const e_video = await upload_irys(Buffer.from(video), "video", _tags)
                            if (e_video?.length) {
                                // const res = await contract.writeInteraction({ function: "upload_video", title, id: e_video, description, tags, thumbnails: thumbnail_id, access_model: accesss })
                                await contract.writeInteraction({ function: "upload_video", title, id: e_video, description, tags, thumbnails: thumbnail_id, access_model: accesss })
                                _setDescription("Writing to Contract")
                                // if (res?.bundlrResponse?.id) {
                                _setOpen(false)
                                window.location.reload()
                                // } else {
                                //     _setOpen(false)
                                //     setDescription([])
                                //     setDescription(["Error in write intercatons in warp contracts"]);
                                //     setOpen(true);
                                // }
                            }
                        } else {
                            _setOpen(false)
                            setDescription([])
                            setDescription(["Error in upload thumnails"]);
                            setOpen(true);
                        }
                    } else {
                        _setOpen(false)
                        setDescription([])
                        setDescription(["Access Type is undefined"]);
                        setOpen(true);
                    }
                } else {
                    _setOpen(false)
                    setDescription([])
                    setDescription(["Derivation Type is undefined"]);
                    setOpen(true);
                }
            } else {

                _setOpen(false)
                setDescription([])
                setDescription(["Commericial Type is undefined"]);
                setOpen(true);
            }
        } else {
            const _playlist = useUserData
                .getState()
                .playlist.find((e) => e.id === playlist);
            if (_playlist?.id) {
                _tags.push({ name: "Playlist-Id", value: _playlist.id })
                if (_playlist.access_model === "exclusive") {
                    _setOpen(true)
                    _setDescription("Uploading thumbnails to irys")
                    const thumbnail_id = await upload_irys(thumbnail, "playlist", _thumbnail_tags)
                    if (thumbnail_id?.length) {
                        _tags.push({ name: "Thumbnail", value: thumbnail_id })
                        _setDescription("Encrypting the video")
                        const crypto = await encrypt(video);
                        _setDescription("Uploading encrypted video to irys")
                        const e_video = await upload_irys(arrayBufferToBase64(crypto.data), "video", _tags)
                        if (e_video?.length) {
                            _setDescription("Writing to Contract")
                            const res = await contract.writeInteraction({ function: "upload_video", playlist: _playlist.id, title, description, tags, id: e_video, thumbnails: thumbnail_id, })
                            // if (res?.bundlrResponse?.id) {
                            console.log(res)
                            console.log(crypto.iv)
                            console.log(crypto.key)
                            const iv_string = Buffer.from(crypto.iv).toString("hex")
                            _setDescription("Encrypting the keys")
                            const hash = await generateSHA256Hash(`${e_video}${JSON.stringify(crypto.key)}${iv_string}`)
                            _setDescription("Uploading encrypted video to irys")
                            const upload = await axios.post("http://localhost:8080/upload", {
                                hash: hash, content_id: e_video, key: crypto.key, iv: iv_string
                            })
                            if (upload.status === 200) {
                                _setOpen(false)
                                window.location.reload()
                            }
                            // } else {
                            //     _setOpen(false)
                            //     setDescription([])
                            //     setDescription(["Error in write interaction is warp contracts"]);
                            //     setOpen(true);
                            // }
                        }
                    } else {
                        _setOpen(false)
                        setDescription([])
                        setDescription(["Error in upload thumnails"]);
                        setOpen(true);
                    }
                } else if (_playlist.access_model === "open") {
                    _setDescription("Uploading thumbnails to irys")
                    const thumbnail_id = await upload_irys(thumbnail, "playlist", _thumbnail_tags)
                    if (thumbnail_id?.length) {
                        _tags.push({ name: "Thumbnail", value: thumbnail_id })
                        _setDescription("Uploading video to irys")
                        const e_video = await upload_irys(Buffer.from(video), "video", _tags)
                        if (e_video?.length) {
                            _setDescription("Writing to Contract")
                            // const res = await contract.writeInteraction({ function: "upload_video", playlist: _playlist.id, title, description, tags, id: e_video, thumbnails: thumbnail_id, })
                            await contract.writeInteraction({ function: "upload_video", playlist: _playlist.id, title, description, tags, id: e_video, thumbnails: thumbnail_id, })
                            // if (res?.bundlrResponse?.id) {
                            window.location.reload()
                            // } else {
                            //     _setOpen(false)
                            //     setDescription([])
                            //     setDescription(["Error in write interaction is warp contracts"]);
                            //     setOpen(true);
                            // }
                        }
                    } else {
                        _setOpen(false)
                        setDescription([])
                        setDescription(["Error in upload thumnails"]);
                        setOpen(true);
                    }
                } else {

                    _setOpen(false)
                    setDescription([])
                    setDescription(["Existed Playlist Model is undefined"]);
                    setOpen(true);
                }
            } else {
                const error = [];
                if (!video?.length) {
                    error.push("Video is Missing");
                }
                if (!title.length) {
                    error.push("Title is missing");
                }
                if (!description.length) {
                    error.push("Description is missing");
                }
                if (!tags.length) {
                    error.push("Tags is missing, Remove all the tags and add again");
                }
                if (!thumbnail.length) {
                    error.push("Thumbnail is missing");
                }
                _setOpen(false)
                setDescription([])
                setDescription(error);
                setOpen(true);
            }
        }
    }
}
export async function encrypt(_data: string): Promise<{
    iv: Uint8Array;
    key: JsonWebKey;
    data: ArrayBuffer;
}> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
    const encoder = new TextEncoder();
    const data = encoder.encode(_data);
    const _encrypted_data = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        data
    );
    const json_key = await window.crypto.subtle.exportKey("jwk", key);
    console.log(data)
    console.log(_encrypted_data)
    return { iv: iv, key: json_key, data: _encrypted_data };
}
export function toBuffer(arrayBuffer: ArrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}
async function generateSHA256Hash(data: string) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
export function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer);
    const string = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
    const base64String = btoa(string);
    return base64String;
}