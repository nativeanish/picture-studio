import { create } from "zustand";
import get_contract from "../utils/getWarp";
import useAddress from "./useAddress";
import useLoader from "./useLoader";
type _u_return = { success: false; data: string } | { success: true, data: User }
type _v_return = { success: false; data: string } | { success: true, data: Video }
type _p_return = { success: false; data: string } | { success: true, data: Playlist }
interface State {
    video: Array<Video> | [];
    playlist: Array<Playlist> | [];
    set_video: () => void;
    set_playlist: () => void;
    get_user: () => void;
    user: User | null;
    _get: () => void;
}
const useUserData = create<State>((set, get) => ({
    video: [],
    playlist: [],
    async set_video() {
        const videolist = get().user?.video
        if (videolist?.length) {
            const contract = await get_contract()
            const _video: Array<Video> = []
            for (let a = 0; a < videolist.length; a++) {
                const data = await contract.viewState<{
                    function: string;
                    id: string;
                }, _v_return>({ function: "get_video", id: videolist[a] })
                if (data.result.success) {
                    _video.push(data.result.data)
                }
            }
            set({ video: _video })
        }
    },
    async set_playlist() {
        const playlist = get().user?.playlist
        if (playlist?.length) {
            const contract = await get_contract()
            const _playlist: Array<Playlist> = []
            for (let a = 0; a < playlist.length; a++) {
                const data = await contract.viewState<{
                    function: string;
                    id: string;
                }, _p_return>({ function: "get_playlist", id: playlist[a] })
                if (data.result.success) {
                    _playlist.push(data.result.data)
                }
            }
            set({ playlist: _playlist })
        }
    },
    get_user: async () => {
        const contract = await get_contract()
        const address = useAddress.getState().address
        const data = await contract.viewState<{
            function: string;
            id: string;
        }, _u_return>({ function: "get_user", id: address?.length ? address : "" })
        if (data.result.success) {
            if (data.result.data.id === address) {
                set({ user: data.result.data })
            }
        } else {
            console.log(data.result.data)
        }
    },
    user: null,
    async _get() {
        const setOpen = useLoader.getState().setOpen
        const description = useLoader.getState().setDescription
        description("Getting the User Details")
        setOpen(true)
        await get().get_user()
        description("Getting Video list")
        await get().set_video()
        description("Getting Playlist")
        await get().set_playlist()
        setOpen(false)
    },
}))
export default useUserData