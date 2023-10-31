import { create } from "zustand"
interface State {
    type: "open" | "paid",
    set_type: (e: "open" | "paid") => void,
    unecrypted_video: string | null,
    set_unecrypted_video: (e: string | null) => void,
    encrypted_video: string | null,
    set_encrypted_video: (e: string) => void,
    video_type: "video/mp4" | "video/webm" | null,
    set_video_type: (e: "video/mp4" | "video/webm" | null) => void
    reset: () => void
}
const useVideo = create<State>((set) => ({
    type: "open",
    set_type: (e) => set({ type: e }),
    unecrypted_video: null,
    set_unecrypted_video: (e) => set({ unecrypted_video: e }),
    encrypted_video: null,
    set_encrypted_video: (e) => set({ encrypted_video: e }),
    video_type: null,
    set_video_type: (e) => set({ video_type: e }),
    reset: () => {
        set({ unecrypted_video: null, encrypted_video: null, video_type: null, })
    }
}))
export default useVideo