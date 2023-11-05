import { create } from "zustand";
export type _derivation = "n" | "a-w-c" | "a-w-i" | "a-w-l-p" | "a-w-25" | "a-w-50" | "a-w-75" | "a-w-100"
interface State {
    title: string;
    description: string;
    tags: Array<string>;
    access_model: "open" | "exclusive";
    thumbnail: string;
    setTitle: (e: string) => void;
    setDescription: (e: string) => void;
    setTags: (e: Array<string>) => void;
    price: string;
    setPrice: (e: string) => void;
    setAccess: (e: "open" | "exclusive") => void;
    setThumbnail: (e: string) => void;
    reset: () => void;
    commerical: "n" | "a" | "a-w-c"
    setCommercial: (e: "n" | "a" | "a-w-c") => void
    derivation: _derivation
    setDerivation: (e: _derivation) => void;
    thumbnail_type: string,
    setThumbnailType: (e: string) => void;
}
const usePlaylist = create<State>((set) => ({
    title: "",
    description: "",
    tags: [],
    access_model: "open",
    price: "",
    thumbnail: "",
    setTitle: (e: string) => set({ title: e }),
    setDescription(e) {
        set({ description: e })
    },
    setTags(e) {
        set({ tags: e })
    },
    setPrice(e) {
        set({ price: e })
    },
    setAccess(e) {
        set({ access_model: e })
    },
    setThumbnail(e) {
        set({ thumbnail: e })
    },
    reset() {
        set({ title: "" })
        set({ description: "" })
        set({ tags: [] })
        set({ access_model: "open" })
        set({ price: "" })
        set({ thumbnail: "" })
        set({ commerical: "n" })
        set({ derivation: "n" })
        set({ thumbnail_type: "" })
    },
    commerical: "n",
    setCommercial(e) {
        set({ commerical: e })
    },
    derivation: "n",
    setDerivation(e) {
        set({ derivation: e })
    },
    thumbnail_type: "",
    setThumbnailType(e) {
        set({ thumbnail: e })
    },
}))
export default usePlaylist