import { create } from "zustand";
interface State {
    type: "arconnect" | "arweave.app" | null,
    setType: (e: "arconnect" | "arweave.app" | null) => void;
}
const useNavBar = create<State>((set) => ({
    type: null,
    setType: (e) => set({ type: e }),
}))
export default useNavBar