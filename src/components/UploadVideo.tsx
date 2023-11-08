import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import Upload_V from "./Upload_V";
import { useState } from "react";
import { upload_video } from "../utils/upload_video";
import useLoader from "../stores/useLoader";
interface argu {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}
function UploadVideo(argu: argu) {
  const [scrollBehavior] = useState<"inside">("inside");

  const _bool = useLoader((state) => state.isOpen);
  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={argu.isOpen}
        onOpenChange={argu.onOpenChange}
        size="2xl"
        scrollBehavior={scrollBehavior}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                Upload
              </ModalHeader>
              <ModalBody className="items-center">
                <div className="flex w-full flex-col">
                  <Upload_V />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => upload_video()}
                  isDisabled={_bool}
                >
                  Upload
                </Button>
                <Button
                  color="danger"
                  className="pl-4"
                  onPress={onClose}
                  isDisabled={_bool}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default UploadVideo;
