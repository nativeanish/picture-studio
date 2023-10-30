import { Card, CardBody } from "@nextui-org/react";
import useVideo from "../stores/useVideo";
import { ChangeEvent, useEffect, useState } from "react";
import { Player } from "./Video_player";

function OpenAccess() {
  const unencrypted_video = useVideo((state) => state.unecrypted_video);
  const set_unencrypted_video = useVideo((state) => state.set_unecrypted_video);
  const video_type = useVideo((state) => state.video_type);
  const set_video_type = useVideo((state) => state.set_video_type);
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (unencrypted_video?.length && video_type?.length) {
      const binaryString = atob(unencrypted_video);
      const binaryData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryData[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([binaryData], { type: video_type });
      const videoURL = URL.createObjectURL(blob);
      setUrl(videoURL);
    }
  }, [unencrypted_video, video_type]);
  const upload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const mar = e.target.files[0].type;
      if (mar === "video/webm" || mar === "video/mp4") {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          set_unencrypted_video((reader.result as string).split(",")[1]);
          set_video_type(mar);
        });
        reader.readAsDataURL(e.target.files[0]);
      } else {
        console.log("YOu have not uploaded video");
      }
    }
  };
  return (
    <>
      <Card fullWidth>
        <CardBody>
          <div>
            <div className="flex items-center justify-center w-full">
              {url?.length &&
              video_type?.length &&
              unencrypted_video?.length ? (
                <Player url={url} />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100 ">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 ">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500 ">
                      Right now we support only MP4 or webm
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={upload}
                  />
                </label>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default OpenAccess;
