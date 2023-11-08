import { WarpFactory } from "warp-contracts";
import { InjectedArweaveSigner } from "warp-contracts-plugin-signature";
import useAddress from "../stores/useAddress";
export default async function get_contract() {
    let userSigner = null
    const address = useAddress.getState().address
    if (window.arweaveWallet && address) {
        userSigner = new InjectedArweaveSigner(window.arweaveWallet);
    }
    userSigner.getAddress = window.arweaveWallet.getActiveAddress;
    await userSigner.setPublicKey();
    const warp = WarpFactory.forTestnet()
    const contract = warp.contract("xH1EwPiTTqCMOXReK2r4BApDas1EpJf50XY9BRlAPMQ").connect(userSigner)
    return contract
}
export async function get_dummy_contract() {
    const warp = WarpFactory.forTestnet()
    const contract = warp.contract("xH1EwPiTTqCMOXReK2r4BApDas1EpJf50XY9BRlAPMQ")
    return contract
}