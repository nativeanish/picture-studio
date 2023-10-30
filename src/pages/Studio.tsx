import { useEffect } from "react";
import useAddress from "../stores/useAddress";
import { useNavigate } from "react-router-dom";
import LocalStorageService from "../hooks/localstorage";
import { automatically_connect } from "../utils/connect";
import NavBar from "../components/NavBar";
import { Button, Image, useDisclosure } from "@nextui-org/react";
import video from "../images/Video_Upload.svg";
import { RiVideoUploadFill } from "react-icons/ri";
import UploadVideo from "../components/UploadVideo";
function Studio() {
  const address = useAddress((state) => state.address);
  const type = useAddress((state) => state.type);
  const navigate = useNavigate();
  const localstorage = LocalStorageService;
  useEffect(() => {
    if (!localstorage.getItem("address")) {
      navigate("/");
    } else {
      automatically_connect();
    }
  }, [localstorage, navigate, address, type]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <NavBar />
      <div className="flex justify-center mt-16">
        <div className="w-80 p-4 rounded">
          <div className="space-x-4">
            <Image src={video} />
            <div className="justify-center items-center flex w-80 mt-16">
              <Button
                color="primary"
                startContent={<RiVideoUploadFill />}
                onPress={onOpen}
              >
                Upload
              </Button>
              <UploadVideo
                onOpen={onOpen}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Studio;
