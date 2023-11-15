import useAddress from "../stores/useAddress"
import useAlert from "../stores/useAlert"
import useLoader from "../stores/useLoader"
import usePlaylist from "../stores/usePlaylist"
import useUserData from "../stores/useUserData"
import { getCommercial, getDerivation } from "./getComandDer"
import get_contract from "./getWarp"
import { upload_irys } from "./upload_irys"
export const uploadPlaylist = () => {
    const setOpen = useAlert.getState().setOpen;
    const setDescription = useAlert.getState().setDescription;
    const _setOpen = useLoader.getState().setOpen
    _uploadPlaylist().then().catch((err) => {
        _setOpen(false);
        setDescription([]);
        setDescription([`There is error: ${err}`])
        setOpen(true)
    })
}
const _uploadPlaylist = async () => {
    const title = usePlaylist.getState().title
    const description = usePlaylist.getState().description
    const tags = usePlaylist.getState().tags
    const access = usePlaylist.getState().access_model
    const price = usePlaylist.getState().price
    const thumbnail = usePlaylist.getState().thumbnail
    const setTitle = useAlert.getState().setTile
    const setDescription = useAlert.getState().setDescription
    const set_open = useAlert.getState().setOpen
    const commerical = getCommercial(usePlaylist.getState().commerical)
    const derivation = getDerivation(usePlaylist.getState().derivation)
    const address = useAddress.getState().address
    const set_playlist = useUserData.getState().set_playlist
    const _setopen = useLoader.getState().setOpen
    const _setDescription = useLoader.getState().setDescription
    const _tags = []
    if (title.length && description.length && tags.length && thumbnail.length) {
        _tags.push({ name: "Content-type", value: "base64" })
        _tags.push({ name: "Title", value: title })
        _tags.push({ name: "Description", value: description })
        _tags.push({ name: "Access-Model", value: access })
        _tags.push({ name: "License", value: "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8" })
        _tags.push({ name: "Commerical-Use", value: commerical })
        _tags.push({ name: "Derivation", value: derivation })
        _tags.push({ name: "Thumbnail", value: "self" })
        if (access === "exclusive") {
            if (!isNaN(parseFloat(price))) {
                _tags.push({ name: "License-Fee", value: String(parseFloat(price) * 1000000000000) })
                _tags.push({ name: "Currency", value: "Arweave" })
                _tags.push({ name: "Payment-Address", value: address?.length ? address : "" })
            } else {
                _setopen(false)
                set_open(true);
                setTitle("Warning")
                setDescription([])
                setDescription(["In exclusive model, the price should be greater than 0 AR."])
                return;
            }
        } else if (access === "open") {
            try {
                _setopen(true)
                _setDescription("Uploading Thumbnails to irys")
                const id = await upload_irys(thumbnail, "playlist", _tags);
                if (id?.length) {
                    const contract = await get_contract()
                    _setDescription("Writing to contract")
                    // const data = await contract.writeInteraction({ function: "create_playlist", title, id: id, description, tags, access_model: access, thumbnails: id })
                    await contract.writeInteraction({ function: "create_playlist", title, id: id, description, tags, access_model: access, thumbnails: id })
                    // if (data?.bundlrResponse?.id) {
                    window.location.reload()
                    // }
                }
            } catch (err) {
                _setopen(false)
                setTitle("Error");
                setDescription([])
                setDescription([`There is an error: ${err}`])
            }
        } else {
            _setopen(false)
            set_open(true);
            setTitle("Warning")
            setDescription([])
            setDescription(["Access Model can be `open` or `exclusive` only."])
            return;
        }
        try {
            _setopen(true)
            _setDescription("Uploading Thumbnails to irys")
            const id = await upload_irys(thumbnail, "playlist", _tags);
            if (id?.length) {
                const contract = await get_contract()
                if (access === "exclusive") {
                    _setDescription("Writing to contract")
                    // const data = await contract.writeInteraction({ function: "create_playlist", title: title, id: id, description: description, tags: tags, access_model: access, thumbnails: id, price_winston: String(parseFloat(price) * 1000000000000) })
                    await contract.writeInteraction({ function: "create_playlist", title: title, id: id, description: description, tags: tags, access_model: access, thumbnails: id, price_winston: String(parseFloat(price) * 1000000000000) })
                    // if (data?.bundlrResponse?.id) {
                    window.location.reload()
                    _setopen(false)
                    await set_playlist()
                    return;
                    // } else {

                    //     _setopen(false)
                    //     set_open(true);
                    //     setTitle("Error");
                    //     setDescription([])
                    //     setDescription(["There is error in interaction with warp contracts"])
                    //     return;
                    // }
                } else {
                    _setDescription("Writing to contract")
                    // const data = await contract.writeInteraction({ function: "create_playlist", title: title, id: id, description: description, tags: tags, access_model: "open", thumbnails: id })
                    await contract.writeInteraction({ function: "create_playlist", title: title, id: id, description: description, tags: tags, access_model: "open", thumbnails: id })
                    // if (data?.bundlrResponse?.id) {
                    window.location.reload()
                    _setopen(false)
                    await set_playlist()
                    return;
                    // } else {

                    //     _setopen(false)
                    //     set_open(true);
                    //     setTitle("Error");
                    //     setDescription([])
                    //     setDescription(["There is error in interaction with warp contracts"])
                    //     return;
                    // }
                }
            } else {
                _setopen(false)
                set_open(true);
                setTitle("Error");
                setDescription([])
                setDescription(["There is error in uploading thumbnails through irys network"])
                return;
            }
        } catch (err) {
            console.log(err)
            _setopen(false)
            set_open(true);
            setTitle("Error");
            setDescription([])
            setDescription([`There is error in saving transcation: ${err}`])
            return;
        }
    } else {
        console.log("Something is Missing")
        const dar = []
        if (!title.length) {
            dar.push("Title is Missing")
        }
        if (!description.length) {
            dar.push("Description is Missing")
        }
        if (!tags.length) {
            dar.push("Tags are Empty. Remove All the tags and add them")
        }
        if (!thumbnail.length) {
            dar.push("Thumbnail is Missing. Upload an Image")
        }
        if (access === "exclusive" && isNaN(parseFloat(price))) {
            dar.push("Add Price in Number")
        }
        _setopen(false)
        setTitle("Warning")
        setDescription([])
        setDescription(dar)
        set_open(true)
    }
}
