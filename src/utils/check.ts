import useAddress from "../stores/useAddress"
import { _automatically_connect } from "./connect"

export const check = async (): Promise<boolean> => {
    await _automatically_connect()
    if (useAddress.getState().address?.length && useAddress.getState().type?.length) {
        return true
    } else {
        return false
    }
    console.log("checking")
}