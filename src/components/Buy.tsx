import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { AiFillAlert } from "react-icons/ai";
import { AiFillWarning } from "react-icons/ai";
import useAlert from "../stores/useAlert";

export default function Buy() {
  const isOpen = useAlert((state) => state.isOpen);
  const description = useAlert((state) => state.description);
  const title = useAlert((state) => state.title);
  const onOpenChange = useAlert((state) => state.onOpenChange);
  const onClose = useAlert((state) => state.onClose);

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
      onClose={onClose}
      onOpenChange={onOpenChange}
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader>
          {title === "Error" ? (
            <Button color="danger" className="w-full" onClick={onClose}>
              <AiFillAlert /> Alert
            </Button>
          ) : (
            <Button color="warning" className="w-full" onClick={onClose}>
              <AiFillWarning /> Warning
            </Button>
          )}
        </ModalHeader>
        <ModalBody>
          {description.length ? (
            <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
              {description.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : (
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Something went wrong.
            </h2>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
