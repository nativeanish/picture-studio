import { create } from "zustand";
import wallet from "../utils/Arweave-wallet";
interface State {
    address: null | string;
    type: "arconnect" | "arweave.app" | null;
    set_address: (_type: "arconnect" | "arweave.app") => void;
    unset_address: () => void;
}
const useAddress = create<State>((set) => ({
    address: null,
    type: null,
    unset_address: () => set({ address: null, type: null }),
    set_address: async (_type) => {
        if (_type === "arconnect") {
            if (window.arweaveWallet) {
                const data = await window.arweaveWallet.getActiveAddress()
                if (data.length) {
                    set({ address: data, type: "arconnect" })
                } else {
                    set({ address: null, type: null })
                }
            }
        }
        if (_type === "arweave.app") {
            const address = wallet.address
            if (address?.length) {
                set({ address: address, type: "arweave.app" })
            } else {
                set({ address: null, type: null })
            }
        }
    }
}))
export default useAddress