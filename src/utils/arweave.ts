import Arweave from "arweave/web"
import usePlaylist from "../stores/usePlaylist"
import useAddress from "../stores/useAddress"
import { getCommercial, getDerivation } from "./getComandDer"
export function getArweaveConfig(): Arweave {
    return Arweave.init({
        host: "43.205.178.185",
        port: 8080,
        protocol: "http",
    })
}
export async function upload_playlist_areweave() {
    const arweave = getArweaveConfig()
    const title = usePlaylist.getState().title
    const description = usePlaylist.getState().description
    const tags = usePlaylist.getState().tags
    const thumbnail = usePlaylist.getState().thumbnail
    const commerical = usePlaylist.getState().commerical
    const derivation = usePlaylist.getState().derivation
    const access = usePlaylist.getState().access_model
    const price = usePlaylist.getState().price
    const address = useAddress.getState().address
    try {
        const transcation = await arweave.createTransaction({
            data: thumbnail
        }, "use_wallet")
        transcation.addTag("Content-type", "base64")
        transcation.addTag("Title", title)
        transcation.addTag("Description", description)
        transcation.addTag("Tags", JSON.stringify(tags))
        transcation.addTag("Access-Model", access)
        transcation.addTag("License", "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8")
        transcation.addTag("Commerical-Use", getCommercial(commerical))
        transcation.addTag("Derivation", getDerivation(derivation))

        if (access === "exclusive") {
            transcation.addTag("License-Fee", price)
            transcation.addTag("Currency", "Arweave")
            transcation.addTag("Payment-Address", address?.length ? address : "")
        }
        await arweave.transactions.sign(transcation, "use_wallet")
        const response = await arweave.transactions.post(transcation)
        if (response.status === 200) {
            return transcation.id
        }
    } catch (err) {
        console.log(err)
    }
}