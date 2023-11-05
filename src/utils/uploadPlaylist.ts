import useAlert from "../stores/useAlert"
import usePlaylist from "../stores/usePlaylist"
import { upload_playlist_areweave } from "./arweave"
import get_contract from "./getWarp"

export const uploadPlaylist = () => {
    const title = usePlaylist.getState().title
    const description = usePlaylist.getState().description
    const tags = usePlaylist.getState().tags
    const access = usePlaylist.getState().access_model
    const price = usePlaylist.getState().price
    const thumbnail = usePlaylist.getState().thumbnail
    const setTitle = useAlert.getState().setTile
    const setDescription = useAlert.getState().setDescription
    const set_open = useAlert.getState().setOpen
    if (title.length && description.length && tags.length && thumbnail.length) {
        if (access === "exclusive" && Number(price) > 0) {
            set_open(true);
            setTitle("Warning")
            setDescription(["In exclusive model, the price should be greater than 0 AR."])
            return
        }
        upload_playlist_areweave().then((data) => {
            if (data?.length) {
                const contract = get_contract()
                contract.writeInteraction({ function: "create_playlist", title, description, id: data, tags, access_model: access, thumbnails: data, price_winston: price })
                    .then((e: any) => console.log(e))
                    .catch((err: any) => {
                        setTitle("Error")
                        setDescription([String(err)])
                        set_open(true)
                    })
            }
        }).catch((err) => console.log(err))
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
        if (access === "exclusive" && !((Number(price) > 0))) {
            dar.push("Add Price in Number")
        }
        setTitle("Warning")
        setDescription(dar)
        set_open(true)
    }
}