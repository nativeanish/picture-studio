import { WebIrys } from "@irys/sdk"

const get_irys = async () => {
    const irys = new WebIrys({ url: "node2", token: "arweave", wallet: { provider: window.arweaveWallet } })
    await irys.ready()
    return irys
}
export async function upload_irys(data: string | Buffer, type: "playlist" | "video", tags: Array<{ name: string, value: string }>) {
    const irys = await get_irys()
    if (type === "playlist") {
        const transcation = await irys.upload(data, { tags: tags });
        return transcation.id
    }
    if (type === "video") {
        const transcation = await irys.upload(data, { tags: tags });
        return transcation.id
    }
}