import { useEffect } from "react";
import useAddress from "../stores/useAddress";
import { useNavigate } from "react-router-dom";
import LocalStorageService from "../hooks/localstorage";
import { automatically_connect } from "../utils/connect";
import NavBar from "../components/NavBar";
import { Button, Divider, Image, useDisclosure } from "@nextui-org/react";
import video from "../images/Video_Upload.svg";
import { RiVideoUploadFill } from "react-icons/ri";
import UploadVideo from "../components/UploadVideo";
import useVideo from "../stores/useVideo";
import Playlist from "../components/Playlist";
import useUserData from "../stores/useUserData";
function Studio() {
  const address = useAddress((state) => state.address);
  const navigate = useNavigate();
  const localstorage = LocalStorageService;
  const _get = useUserData((state) => state._get);
  useEffect(() => {
    if (!localstorage.getItem("address")) {
      navigate("/");
    } else {
      automatically_connect();
      if (address?.length) {
        _get();
      }
    }
  }, [localstorage, navigate, address, _get]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const reset = useVideo((state) => state.reset);
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
                onClick={() => reset()}
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
      <div className="pt-4">
        <Divider />
        <div>
          <Playlist />
        </div>
      </div>
    </>
  );
}

export default Studio;
