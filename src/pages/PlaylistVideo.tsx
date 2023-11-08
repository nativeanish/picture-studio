import { useParams } from "react-router-dom";

function PlaylistVideo() {
  const { id, v_id } = useParams();
  return (
    <>
      <h1>{id}</h1>
      <h1>{v_id}</h1>
    </>
  );
}

export default PlaylistVideo;
