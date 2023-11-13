import { WarpFactory } from "warp-contracts";
import { InjectedArweaveSigner } from "warp-contracts-plugin-signature";
import useAddress from "../stores/useAddress";
import Arweave from "arweave";
const arweave = Arweave.init({
    host: "65.1.2.24",
    port: 8080,
    protocol: "http"
})
const warp = WarpFactory.forLocal(8080, arweave)
export default async function get_contract() {
    // let userSigner = null
    // const address = useAddress.getState().address
    // if (window.arweaveWallet && address) {
    //     userSigner = new InjectedArweaveSigner(window.arweaveWallet);
    // }
    // userSigner.getAddress = window.arweaveWallet.getActiveAddress;
    // await userSigner.setPublicKey();
    // const warp = WarpFactory.forTestnet()
    const contract = warp.contract<State>("gmURir_NTZAVNeGGmTflnkhV2XyMfRyUomi576SXipQ").connect("use_wallet")
    return contract
}
export async function get_dummy_contract() {
    // const warp = WarpFactory.forTestnet()
    const contract = warp.contract<State>("gmURir_NTZAVNeGGmTflnkhV2XyMfRyUomi576SXipQ")
    return contract
}