import ReactPlayer from "react-player";

interface argu {
  url: string;
  thumbnail?: string;
}
const VideoPlayer = (arg: argu) => {
  return (
    <div className="aspect-video">
      <ReactPlayer
        url={arg.url}
        playing={true}
        controls={true}
        width="100%"
        height="100%"
        light={arg.thumbnail}
      />
    </div>
  );
};

export default VideoPlayer;
