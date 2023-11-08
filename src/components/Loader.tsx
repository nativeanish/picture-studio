import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import useLoader from "../stores/useLoader";
import { RingLoader } from "react-spinners";
export default function Loader() {
  const isOpen = useLoader((state) => state.isOpen);
  const description = useLoader((state) => state.description);
  const onOpenChange = useLoader((state) => state.onOpenChange);
  const setOpen = useLoader((state) => state.setOpen);
  return (
    <Modal
      size={"lg"}
      isOpen={isOpen}
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
      onOpenChange={onOpenChange}
      hideCloseButton
    >
      <ModalContent>
        <>
          <ModalBody className="items-center">
            <RingLoader size="100" color="#2113a2" speedMultiplier={1.5} />
            {description.length ? (
              <h4 className="text-2xl font-bold dark:text-white">
                {description}
              </h4>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => setOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
