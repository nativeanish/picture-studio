import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Code,
} from "@nextui-org/react";
import useAddress from "../stores/useAddress";
import disconnect from "../utils/disconnect";
interface argu {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}
function Profile(argu: argu) {
  const address = useAddress((state) => state.address);
  const type = useAddress((state) => state.type);
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
                  Profile
                </ModalHeader>
                <ModalBody className="items-center">
                  <Avatar
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
                    className="w-20 h-20 text-large"
                  />
                  <div className="pt-4">
                    <Code color="primary">{address}</Code>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    className="pl-4"
                    onClick={() => disconnect()}
                    onPress={onClose}
                  >
                    Disconnect
                  </Button>
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

export default Profile;
