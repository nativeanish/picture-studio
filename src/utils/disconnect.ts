import LocalStorageService from "../hooks/localstorage"
import useAddress from "../stores/useAddress"
import wallet from "./Arweave-wallet"

export default function disconnect() {
    _disconnect().then().catch((err) => console.log(err))
}
const _disconnect = async () => {
    //arconnect
    const address = useAddress.getState().address
    const type = useAddress.getState().type
    const localStorage = LocalStorageService
    if (address?.length && type === "arconnect") {
        if (window.arweaveWallet) {
            try {
                await window.arweaveWallet.disconnect()
                useAddress.getState().unset_address()
                localStorage.removeItem("address")
            } catch (err) {
                console.log(err)
            }

        }
    }
    //arweave.app
    if (address?.length && type === "arweave.app") {
        try {
            await wallet.disconnect()
            useAddress.getState().unset_address()
            localStorage.removeItem("address")
        } catch (err) {
            console.log(err)
        }
    }
}