import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import useAddress from "../stores/useAddress";
import { useState } from "react";
interface argu {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}
function PlaylistModal(argu: argu) {
  const address = useAddress((state) => state.address);
  const type = useAddress((state) => state.type);
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
  return (
    <>
      {address?.length && type?.length ? (
        <Modal
          backdrop="blur"
          isOpen={argu.isOpen}
          onOpenChange={argu.onOpenChange}
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
                  />
                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter your description for your Playlist"
                    color="primary"
                    variant="bordered"
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
                  <div className="w-full">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="thumbnailUpload"
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
                  <div className="w-full">
                    <Select
                      label="What will be access model ?"
                      placeholder="What will be access model ?"
                      defaultSelectedKeys={["open"]}
                    >
                      <SelectItem key={"open"} value="open">
                        Open
                      </SelectItem>
                      <SelectItem key={"exclusive"} value="exclusive">
                        Exclusive
                      </SelectItem>
                    </Select>
                  </div>
                  <div className="w-full">
                    <Select
                      label="Do you want to upload teaser ?"
                      placeholder="Do you want to upload teaser ?"
                      defaultSelectedKeys={["open"]}
                    >
                      <SelectItem key={"open"} value="open">
                        No
                      </SelectItem>
                      <SelectItem key={"exclusive"} value="exclusive">
                        Yes
                      </SelectItem>
                    </Select>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
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
