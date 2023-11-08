import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import useVideo from "../stores/useVideo";
import { ChangeEvent, useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import PlaylistModal from "./PlaylistModal";
import usePlaylist from "../stores/usePlaylist";
import useAddress from "../stores/useAddress";
import Arweave from "../images/Arweave-app";
import useAlert from "../stores/useAlert";
import VideoPlayer from "./VideoPlayer";
function Upload_V() {
  const unencrypted_video = useVideo((state) => state.unecrypted_video);
  const set_unencrypted_video = useVideo((state) => state.set_unecrypted_video);
  const video_type = useVideo((state) => state.video_type);
  const set_video_type = useVideo((state) => state.set_video_type);
  const [url, setUrl] = useState<string | null>(null);
  const reset = useVideo((state) => state.reset);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const access = useVideo((state) => state.access);
  const setAccess = useVideo((state) => state.set_access);
  const address = useAddress((state) => state.address);
  const set_price = useVideo((state) => state.setPrice);
  const setTitle = useVideo((state) => state.setTitle);
  const setDescription = useVideo((state) => state.setDescription);
  const tags = useVideo((state) => state.tags);
  const setTags = useVideo((state) => state.setTags);
  const playlist = useVideo((state) => state.playlist);
  const set_playlist = useVideo((state) => state.set_playlist);
  const set_selected_playlist = useVideo(
    (state) => state.set_selected_playlist
  );
  const setOpen = useAlert((state) => state.setOpen);
  const setDes = useAlert((state) => state.setDescription);
  const selected_playlist = useVideo((state) => state.selected_playlist);
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
    set_playlist();
  }, [unencrypted_video, video_type, set_playlist]);
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
        setDes([]);
        setDes(["Only MP4 or WEBM is only supported"]);
        setOpen(true);
      }
    }
  };
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
  const _reset = usePlaylist((state) => state.reset);
  const commerical = useVideo((state) => state.commerical);
  const setCommerical = useVideo((state) => state.setCommercial);
  const derivation = useVideo((state) => state.derivation);
  const setDerivation = useVideo((state) => state.setDerivation);
  const thumbnail = useVideo((state) => state.thumbnail);
  const set_thumbnail = useVideo((state) => state.setThumbnail);
  const upload_thumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const mar = e.target.files[0].type;
      if (
        mar === "image/png" ||
        mar === "image/svg+xml" ||
        mar === "image/jpeg"
      ) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          set_thumbnail(reader.result as string);
        });
        reader.readAsDataURL(e.target.files[0]);
      } else {
        setDes([]);
        setDes(["Only PNG, SVG, JPEG or JPG is only supported"]);
        setOpen(true);
      }
    }
  };
  return (
    <>
      {address && address.length ? (
        <>
          <Card fullWidth>
            <CardBody>
              <div>
                <div className="flex items-center justify-center w-full">
                  {url?.length &&
                  video_type?.length &&
                  unencrypted_video?.length ? (
                    <div className="flex flex-col space-y-4">
                      <VideoPlayer url={url} />
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
                        onChange={(e) => setTitle(e.currentTarget.value)}
                      />
                      <Textarea
                        label="Description"
                        labelPlacement="outside"
                        placeholder="Enter your description for your Video"
                        color="primary"
                        variant="bordered"
                        onChange={(e) => setDescription(e.currentTarget.value)}
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
                      {thumbnail.length ? (
                        <div>
                          <Image
                            src={thumbnail}
                            className="w-full object-cover aspect-video"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-center w-full aspect-video">
                            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
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
                                onChange={upload_thumbnail}
                                accept="image/*"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                      <div>
                        {playlist.length ? (
                          <Select
                            label="Playlist"
                            placeholder="Select Playlist to add your video"
                            items={playlist}
                            selectionMode="single"
                            defaultSelectedKeys={[selected_playlist]}
                            onSelectionChange={(e) =>
                              set_selected_playlist([...e][0] as string)
                            }
                          >
                            {(playlist) => (
                              <SelectItem
                                key={playlist.id}
                                value={playlist.id}
                                onPress={
                                  playlist.id === "+new" ? onOpen : () => {}
                                }
                                onClick={
                                  playlist.id === "+new"
                                    ? () => _reset()
                                    : () => {}
                                }
                              >
                                {playlist.title}
                              </SelectItem>
                            )}
                          </Select>
                        ) : (
                          <Select
                            label="Playlist"
                            placeholder="Select Playlist to add your video"
                            selectionMode="single"
                            defaultSelectedKeys={["none"]}
                          >
                            <SelectItem key="none" value="none">
                              None
                            </SelectItem>
                            <SelectItem
                              key="+add_one"
                              value="+add_one"
                              onPress={onOpen}
                              onClick={() => _reset()}
                            >
                              [+] New Playlist
                            </SelectItem>
                          </Select>
                        )}
                      </div>
                      {selected_playlist === "none" ? (
                        <>
                          <div>
                            <Select
                              label="Commercial Use"
                              placeholder="What will be Commerical model ?"
                              defaultSelectedKeys={[commerical]}
                              selectionMode="single"
                              onSelectionChange={(e) =>
                                ([...e][0] as string) === "n"
                                  ? setCommerical("n")
                                  : ([...e][0] as string) === "a"
                                  ? setCommerical("a")
                                  : ([...e][0] as string) === "a-w-c"
                                  ? setCommerical("a-w-c")
                                  : null
                              }
                            >
                              <SelectItem key={"n"} value="n">
                                None
                              </SelectItem>
                              <SelectItem key={"a"} value="a">
                                Allowed
                              </SelectItem>
                              <SelectItem key={"a-w-c"} value="a-w-c">
                                Allowed-With-Credit
                              </SelectItem>
                            </Select>
                          </div>
                          <div>
                            <Select
                              label="Derivation"
                              placeholder="What will be derivation model ?"
                              defaultSelectedKeys={[derivation]}
                              selectionMode="single"
                              onSelectionChange={(e) =>
                                ([...e][0] as string) === "n"
                                  ? setDerivation("n")
                                  : ([...e][0] as string) === "a-w-c"
                                  ? setDerivation("a-w-c")
                                  : ([...e][0] as string) === "a-w-i"
                                  ? setDerivation("a-w-i")
                                  : ([...e][0] as string) === "a-w-l-p"
                                  ? setDerivation("a-w-l-p")
                                  : ([...e][0] as string) === "a-w-25"
                                  ? setDerivation("a-w-25")
                                  : ([...e][0] as string) === "a-w-50"
                                  ? setDerivation("a-w-50")
                                  : ([...e][0] as string) === "a-w-75"
                                  ? setDerivation("a-w-75")
                                  : ([...e][0] as string) === "a-w-100"
                                  ? setDerivation("a-w-100")
                                  : null
                              }
                            >
                              <SelectItem key={"n"} value="n">
                                None
                              </SelectItem>
                              <SelectItem key={"a-w-c"} value="a-w-c">
                                Allowed-With-Credit
                              </SelectItem>
                              <SelectItem key={"a-w-i"} value="a-w-i">
                                Allowed-With-Indication
                              </SelectItem>
                              <SelectItem key={"a-w-l-p"} value="a-w-l-p">
                                Allowed-With-License-Passthrough
                              </SelectItem>
                              <SelectItem key={"a-w-25"} value="a-w-25">
                                Allowed-With-RevenueShare-25%
                              </SelectItem>
                              <SelectItem key={"a-w-50"} value="a-w-50">
                                Allowed-With-RevenueShare-50%
                              </SelectItem>
                              <SelectItem key={"a-w-75"} value="a-w-75">
                                Allowed-With-RevenueShare-75%
                              </SelectItem>
                              <SelectItem key={"a-w-100"} value="a-w-100">
                                Allowed-With-RevenueShare-100%
                              </SelectItem>
                            </Select>
                          </div>
                          <div>
                            <Select
                              label="Access Type"
                              placeholder="Select Access Type of your video"
                              defaultSelectedKeys={[access]}
                              onSelectionChange={(e) =>
                                ([...e][0] as string) === "open"
                                  ? setAccess("open")
                                  : ([...e][0] as string) === "exclusive"
                                  ? setAccess("exclusive")
                                  : null
                              }
                            >
                              <SelectItem key={"open"} value="open">
                                Open
                              </SelectItem>
                              <SelectItem key={"exclusive"} value="exclusive">
                                Exclusive
                              </SelectItem>
                            </Select>
                          </div>
                        </>
                      ) : null}
                      {access === "exclusive" &&
                      selected_playlist === "none" ? (
                        <>
                          <div className="w-full">
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
                              onChange={(e) =>
                                set_price(String(e.currentTarget.value))
                              }
                            />
                          </div>
                          <div className="w-full">
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
                        </>
                      ) : null}
                      <div className="pl-2 flex space-x-4">
                        <IoNotifications />
                        <p className="text-xs">
                          With Above configuration, You have automatically added
                          an UDL license. You can learn more about UDL license
                          from{" "}
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
                        accept="video/*"
                      />
                    </label>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>{" "}
        </>
      ) : null}
      <PlaylistModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
}

export default Upload_V;
