import { create } from "zustand";

interface State {
    title: "Error" | "Warning"
    description: Array<string>
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
    setOpen: (e: boolean) => void;
    setTile: (e: "Error" | "Warning") => void;
    setDescription: (e: Array<string>) => void;
    onClose: () => void;
}
const useAlert = create<State>((set) => ({
    title: "Warning",
    description: [],
    isOpen: false,
    onOpen: () => { },
    onOpenChange: () => { },
    setTile(e) {
        set({ title: e })
    },
    setDescription(e) {
        set({ description: e })
    },
    setOpen(e) {
        set({ isOpen: e })
    },
    onClose() {
        set({ isOpen: false })
        set({ title: "Warning" })
        set({ description: [] })
    },
}))
export default useAlert