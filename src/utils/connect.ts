import useAddress from "../stores/useAddress";
import useNavBar from "../stores/useNavBar";
import wallet from "./Arweave-wallet";

export default function connect() {
    const _type = useNavBar.getState().type
    if (_type === "arconnect") {
        useNavBar.getState().setType(null)
        arconnect_connect().then(() => useNavBar.getState().setType("arconnect")).catch((err) => {
            console.log(err)
            useNavBar.getState().setType("arconnect")
        })
    }
    if (_type === "arweave.app") {
        useNavBar.getState().setType(null)
        arweave_app_connect().then(() => useNavBar.getState().setType("arweave.app")).catch((err) => {
            useNavBar.getState().setType("arweave.app")
            console.log(err)
        })
    }
}
const arconnect_connect = async () => {
    if (window.arweaveWallet) {
        try {
            const data = await window.arweaveWallet.getActiveAddress()
            if (data.length) {
                await useAddress.getState().set_address("arconnect")
            }
        } catch (err) {
            try {
                await window.arweaveWallet.connect([
                    "ACCESS_ADDRESS"
                    , "ACCESS_PUBLIC_KEY"
                    , "ACCESS_ALL_ADDRESSES"
                    , "SIGN_TRANSACTION"
                    , "ENCRYPT"
                    , "DECRYPT"
                    , "SIGNATURE"
                ])
                await arconnect_connect()
            } catch (error) {
                console.log(error)
                useAddress.getState().unset_address()
                useNavBar.getState().setType("arconnect")
            }
        }
    }
}

const arweave_app_connect = async () => {
    try {
        await wallet.connect()
        if (wallet.address?.length) {
            await useAddress.getState().set_address("arweave.app")
            useNavBar.getState().setType("arweave.app")
        }
    } catch (err) {
        console.log(err)
        useNavBar.getState().setType("arweave.app")
    }
}

export const _automatically_connect = async () => {
    //ArConnect
    window.addEventListener("arweaveWalletLoaded", () => {
        window.arweaveWallet.getActiveAddress().then((e) => {
            if (e.length) {
                useAddress.getState().set_address("arconnect")
                useNavBar.getState().setType("arconnect")
            }
        })
    })

    if (useAddress.getState().address?.length && useAddress.getState().type === "arconnect") {
        return;
    }

    const address = wallet.address
    if (address?.length) {
        await useAddress.getState().set_address("arweave.app")
        useNavBar.getState().setType("arweave.app")
        return;
    }
    useNavBar.getState().setType("arconnect")
}
export const automatically_connect = () => {
    _automatically_connect().then().catch((err) => console.log(err))
}