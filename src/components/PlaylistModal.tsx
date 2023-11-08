import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import useAddress from "../stores/useAddress";
import { ChangeEvent, useState } from "react";
import usePlaylist from "../stores/usePlaylist";
import Arweave from "../images/Arweave-app";
import { uploadPlaylist } from "../utils/uploadPlaylist";
import { IoNotifications } from "react-icons/io5";
import useAlert from "../stores/useAlert";
import useLoader from "../stores/useLoader";
interface argu {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}
function PlaylistModal(argu: argu) {
  const address = useAddress((state) => state.address);
  const type = useAddress((state) => state.type);
  const [inputValue, setInputValue] = useState("");
  const setTitle = usePlaylist((state) => state.setTitle);
  const setDescription = usePlaylist((state) => state.setDescription);
  const setTags = usePlaylist((state) => state.setTags);
  const access_model = usePlaylist((state) => state.access_model);
  const setAccess = usePlaylist((state) => state.setAccess);
  const setprice = usePlaylist((state) => state.setPrice);
  const tags = usePlaylist((state) => state.tags);
  const thumbnail = usePlaylist((state) => state.thumbnail);
  const set_thumbnail = usePlaylist((state) => state.setThumbnail);
  const commerical = usePlaylist((state) => state.commerical);
  const setCommerical = usePlaylist((state) => state.setCommercial);
  const derivation = usePlaylist((state) => state.derivation);
  const setDerivation = usePlaylist((state) => state.setDerivation);
  const [scrollBehavior] = useState<"inside">("inside");
  const setOpen = useAlert((state) => state.setOpen);
  const set_Description = useAlert((state) => state.setDescription);
  const _bool = useLoader((state) => state.isOpen);
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
        setOpen(true);
        set_Description([]);
        set_Description(["PNG, JPG, JPEG or SVG is only supported"]);
      }
    }
  };

  return (
    <>
      {address?.length && type?.length ? (
        <Modal
          backdrop="blur"
          isOpen={argu.isOpen}
          onOpenChange={argu.onOpenChange}
          scrollBehavior={scrollBehavior}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-center">
                  PlayList Creator
                </ModalHeader>
                <ModalBody className="items-center">
                  <Input
                    type="text"
                    label="Title"
                    placeholder="Title of Your Plyalist"
                    color="primary"
                    variant="bordered"
                    onChange={(e) => setTitle(e.currentTarget.value)}
                  />
                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter your description for your Playlist"
                    color="primary"
                    variant="bordered"
                    onChange={(e) => setDescription(e.currentTarget.value)}
                  />
                  <div className="flex flex-wrap gap-2 border border-gray-300 w-full">
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
                    <div className="w-full">
                      <Image
                        src={thumbnail}
                        className="w-full object-cover"
                        width={400}
                        height={128}
                        style={{ width: "400px", height: "128px" }}
                      />
                    </div>
                  ) : (
                    <div className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id="thumbnailUpload"
                        onChange={upload_thumbnail}
                      />
                      <label
                        htmlFor="thumbnailUpload"
                        className="w-full h-32 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer"
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <span>Click to upload Thumbnails</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG or JPG{" "}
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                  <div className="w-full">
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
                  <div className="w-full">
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

                  <div className="w-full">
                    <Select
                      label="What will be access model ?"
                      placeholder="What will be access model ?"
                      defaultSelectedKeys={[access_model]}
                      selectionMode="single"
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
                  {access_model === "exclusive" ? (
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
                            setprice(String(e.currentTarget.value))
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
                  <div className="pl-2 flex space-x-4 w-full">
                    <IoNotifications />
                    <p className="text-xs">
                      With Above configuration, You have automatically added an
                      UDL license. You can learn more about UDL license from{" "}
                      <a
                        className="text-blue-900 after:content-['_↗'] ..."
                        href="https://www.arweave.net/yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8"
                        target="_blank"
                      >
                        here
                      </a>
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={() => uploadPlaylist()}
                    isDisabled={_bool}
                  >
                    Upload
                  </Button>
                  <Button color="danger" onPress={onClose} isDisabled={_bool}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      ) : (
        console.log("Something Went Wrong")
      )}
    </>
  );
}

export default PlaylistModal;
