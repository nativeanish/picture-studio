import Arweave from "arweave/web";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { WarpFactory } from "warp-contracts";

export default function get_contract() {
    const arweave = Arweave.init({
        host: "43.205.178.185",
        port: 8080,
        protocol: "http",
    })
    const warp = WarpFactory.forLocal(8080, arweave)
    const contract = warp.contract("7x2R7DhjTNKlnnJ5LURrTdfSQvxgWoVxwcAcMy0__-c").connect("use_wallet")
    return contract
}