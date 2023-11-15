import { WarpFactory } from "warp-contracts";
import { InjectedArweaveSigner } from "warp-contracts-plugin-signature";
import useAddress from "../stores/useAddress";
// import Arweave from "arweave";
// const arweave = Arweave.init({
//     host: "35.154.154.73",
//     port: 8080,
//     protocol: "http"
// })
const warp = WarpFactory.forTestnet()
export default async function get_contract() {
    let userSigner = null
    const address = useAddress.getState().address
    if (window.arweaveWallet && address) {
        userSigner = new InjectedArweaveSigner(window.arweaveWallet);
    }
    userSigner.getAddress = window.arweaveWallet.getActiveAddress;
    await userSigner.setPublicKey();
    const warp = WarpFactory.forTestnet()
    const contract = warp.contract<State>("3LiqcAUlPPtX_t-3EY1MAdHLw1V5Yo4nMrwiqalj3vE").connect(userSigner)
    return contract
}
export async function get_dummy_contract() {
    // const warp = WarpFactory.forTestnet()
    const contract = warp.contract<State>("3LiqcAUlPPtX_t-3EY1MAdHLw1V5Yo4nMrwiqalj3vE")
    return contract
}