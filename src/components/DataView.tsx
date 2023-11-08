import { useEffect, useState } from "react";
import useUserData from "../stores/useUserData";
import Data from "./Data";
type _type = Array<{ type: "video" | "playlist"; data: Video | Playlist }>;
function DataView() {
  const video = useUserData((data) => data.video);
  const playlist = useUserData((data) => data.playlist);
  const [data, setData] = useState<null | _type>(null);
  useEffect(() => {
    if (video.length || playlist.length) {
      const _data: _type = [];
      video.length
        ? video.map((e) => _data.push({ type: "video", data: e }))
        : null;
      playlist.length
        ? playlist.map((e) => _data.push({ type: "playlist", data: e }))
        : null;
      setData(
        _data.sort((a, b) => a.data.timestamp.localeCompare(b.data.timestamp))
      );
    }
  }, [video, playlist]);
  return (
    <div>
      <>
        {data?.length ? (
          <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">
              Combined Videos and Playlists
            </h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Thumbnail</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Access Model</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Timestamp</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, key) => (
                  <Data
                    key={key}
                    thumbnail={item.data.thumbnails}
                    title={item.data.title}
                    type={item.type}
                    access_model={item.data.access_model}
                    description={item.data.description}
                    timestamp={item.data.timestamp}
                    id={item.data.id}
                    index={key}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h2 className="text-2xl font-bold mb-4">
            No videos or playlist found
          </h2>
        )}
      </>
    </div>
  );
}

export default DataView;
