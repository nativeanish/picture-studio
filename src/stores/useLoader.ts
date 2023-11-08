import { create } from "zustand";

interface State {
    description: string;
    isOpen: boolean
    onOpen: () => void;
    onOpenChange: () => void;
    setDescription: (e: string) => void;
    onClose: () => void;
    setOpen: (e: boolean) => void;
}
const useLoader = create<State>((set) => ({
    description: "",
    isOpen: false,
    onOpen: () => { },
    setDescription(e) {
        set({ description: e })
    },
    onClose: () => { },
    onOpenChange: () => { },
    setOpen(e) {
        set({ isOpen: e })
    },
}))
export default useLoader;