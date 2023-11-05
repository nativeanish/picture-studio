import { create } from "zustand"
import useUserData from "./useUserData"
type _playlist = { id: string, title: string }
export type _derivation = "n" | "a-w-c" | "a-w-i" | "a-w-l-p" | "a-w-25" | "a-w-50" | "a-w-75" | "a-w-100"
interface State {
    unecrypted_video: string | null,
    set_unecrypted_video: (e: string | null) => void,
    encrypted_video: string | null,
    set_encrypted_video: (e: string) => void,
    video_type: "video/mp4" | "video/webm" | null,
    set_video_type: (e: "video/mp4" | "video/webm" | null) => void
    reset: () => void,
    access: "open" | "exclusive",
    set_access: (e: "open" | "exclusive") => void
    price: string
    setPrice: (e: string) => void;
    commerical: "n" | "a" | "a-w-c"
    setCommercial: (e: "n" | "a" | "a-w-c") => void
    derivation: _derivation
    setDerivation: (e: _derivation) => void;
    thumbnail: string;
    setThumbnail: (e: string) => void;
    title: string;
    description: string;
    tags: Array<string>;
    setTitle: (e: string) => void;
    setDescription: (e: string) => void;
    setTags: (e: Array<string>) => void;
    playlist: Array<_playlist>
    set_playlist: () => void;
    selected_playlist: string
    set_selected_playlist: (e: string) => void;
}
const useVideo = create<State>((set) => ({
    title: "",
    description: "",
    tags: [],
    playlist: [],
    set_playlist() {
        const data = useUserData.getState().playlist
        const _temp: Array<_playlist> = [{ id: "none", title: "[-] None" }]
        if (data.length) {
            data.map((e) => _temp.push({ id: e.id, title: e.title }))
        }
        _temp.push({ id: "+new", title: "[+] New Playlist" })
        set({ playlist: _temp })
    },
    set_selected_playlist(e) {
        set({ selected_playlist: e })
    },
    selected_playlist: "none",
    unecrypted_video: null,
    set_unecrypted_video: (e) => set({ unecrypted_video: e }),
    encrypted_video: null,
    set_encrypted_video: (e) => set({ encrypted_video: e }),
    video_type: null,
    set_video_type: (e) => set({ video_type: e }),
    access: "open",
    set_access(e) {
        set({ access: e })
    },
    price: "",
    setPrice(e) {
        set({ price: e })
    },
    commerical: "n",
    setCommercial(e) {
        set({ commerical: e })
    },
    derivation: "n",
    setDerivation(e) {
        set({ derivation: e })
    },
    thumbnail: "",
    setThumbnail(e) {
        set({ thumbnail: e })
    },
    setTitle: (e: string) => set({ title: e }),
    setDescription(e) {
        set({ description: e })
    },
    setTags(e) {
        set({ tags: e })
    },
    reset: () => {
        set({ unecrypted_video: null, encrypted_video: null, video_type: null, access: "open", price: "", commerical: "n", derivation: "n", thumbnail: "", title: "", description: "" })
    },

}))
export default useVideo