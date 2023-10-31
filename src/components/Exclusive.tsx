import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import useVideo from "../stores/useVideo";
import { ChangeEvent, useEffect, useState } from "react";
import { Player } from "./Video_player";
import { AiFillDelete } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import useAddress from "../stores/useAddress";
import Arweave from "../images/Arweave-app";
function Exclusive() {
  const unencrypted_video = useVideo((state) => state.unecrypted_video);
  const set_unencrypted_video = useVideo((state) => state.set_unecrypted_video);
  const video_type = useVideo((state) => state.video_type);
  const set_video_type = useVideo((state) => state.set_video_type);
  const [url, setUrl] = useState<string | null>(null);
  const reset = useVideo((state) => state.reset);
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
  const [tags, setTags] = useState<Array<string>>([]);
  const [inputValue, setInputValue] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (inputValue.trim() !== "") {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  const handleTagDelete = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };
  const address = useAddress((state) => state.address);
  return (
    <>
      <Card fullWidth>
        <CardBody>
          <div>
            <div className="flex items-center justify-center w-full">
              {url?.length &&
              video_type?.length &&
              unencrypted_video?.length ? (
                <div className="flex flex-col space-y-4">
                  <Player url={url} />
                  <Button
                    startContent={<AiFillDelete />}
                    color="danger"
                    onClick={() => {
                      setUrl(null);
                      reset();
                    }}
                  >
                    Remove this Video
                  </Button>
                  <Input
                    type="text"
                    label="Title"
                    placeholder="Title of Your Video"
                    color="primary"
                    variant="bordered"
                  />
                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter your description for your Video"
                    color="primary"
                    variant="bordered"
                  />
                  <div className="flex flex-wrap gap-2 border border-gray-300">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="bg-blue-500 text-white px-2 py-1 rounded flex items-center"
                      >
                        {tag}
                        <button
                          className="ml-2 text-white font-bold"
                          onClick={() => handleTagDelete(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <Input
                      type="text"
                      placeholder="Type and press Enter to add tags"
                      className="border-none outline-none flex-1"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      color="primary"
                      variant="bordered"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-22 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload your Thumbnails
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG or JPG
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <Select
                      label="Playlist"
                      placeholder="Select Playlist to add your video"
                      defaultSelectedKeys={["none"]}
                    >
                      <SelectItem key={"none"} value="none">
                        None
                      </SelectItem>
                    </Select>
                  </div>
                  <div>
                    <Select
                      label="Commerical Use"
                      placeholder="Select Playlist to add your video"
                      defaultSelectedKeys={["allow"]}
                    >
                      <SelectItem key={"allow"} value="allow">
                        Allow
                      </SelectItem>
                    </Select>
                  </div>
                  <div>
                    <Select
                      label="Derivation"
                      placeholder="Select Playlist to add your video"
                      defaultSelectedKeys={["allow"]}
                    >
                      <SelectItem key={"allow"} value="allow">
                        Allow
                      </SelectItem>
                    </Select>
                  </div>
                  {address?.length ? (
                    <div>
                      <Select
                        label="Payment Address"
                        defaultSelectedKeys={["address"]}
                        isDisabled
                      >
                        <SelectItem key={"address"} value={address}>
                          {address}
                        </SelectItem>
                      </Select>
                    </div>
                  ) : null}
                  <div>
                    <Select
                      label="Payment Currency"
                      defaultSelectedKeys={["arweave"]}
                    >
                      <SelectItem key={"arweave"} value={"arweave"}>
                        Arweave
                      </SelectItem>
                    </Select>
                  </div>
                  <div>
                    <Input
                      type="number"
                      label="Price in AR"
                      placeholder="0.00"
                      labelPlacement="outside"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <Arweave />
                        </div>
                      }
                    />
                  </div>
                  <div className="pl-2 flex space-x-4">
                    <IoNotifications />
                    <p className="text-xs">
                      With Above configuration, You have automatically added an
                      UDL license. You can learn more about UDL license from{" "}
                      <a
                        className="text-zinc-900 after:content-['_↗'] ..."
                        href="https://www.gogle.com"
                        target="_blank"
                      >
                        here
                      </a>
                    </p>
                  </div>
                </div>
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

export default Exclusive;
