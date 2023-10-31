import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { TbPremiumRights } from "react-icons/tb";
import { CgCommunity } from "react-icons/cg";
import OpenAccess from "./OpenAccess";
import Exclusive from "./Exclusive";
import useVideo from "../stores/useVideo";
import { useState } from "react";
interface argu {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}
function UploadVideo(argu: argu) {
  const type = useVideo((state) => state.type);
  const set_type = useVideo((state) => state.set_type);
  const [scrollBehavior] = useState<"inside">("inside");
  const reset = useVideo((state) => state.reset);
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
                  <Tabs
                    fullWidth
                    aria-label="Options"
                    color="warning"
                    defaultSelectedKey={type}
                    selectedKey={type}
                    onSelectionChange={(e) =>
                      e === "open" ? (
                        <>
                          {set_type("open")}
                          {reset()}{" "}
                        </>
                      ) : e === "paid" ? (
                        <>
                          {set_type("paid")}
                          {reset()}
                        </>
                      ) : null
                    }
                  >
                    <Tab
                      key="open"
                      title={
                        <div className="flex items-center space-x-2">
                          <CgCommunity />
                          <span>Open Access</span>
                        </div>
                      }
                    >
                      <OpenAccess />
                    </Tab>
                    <Tab
                      key="paid"
                      title={
                        <div className="flex items-center space-x-2">
                          <TbPremiumRights />
                          <span>Exclusive Content</span>
                        </div>
                      }
                    >
                      <Exclusive />
                    </Tab>
                  </Tabs>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" className="pl-4" onPress={onClose}>
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
