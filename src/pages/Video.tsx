import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Query from "@irys/query";
import axios from "axios";
import { get_dummy_contract } from "../utils/getWarp";
import VideoPlayer from "../components/VideoPlayer";
import { Accordion, AccordionItem, Chip } from "@nextui-org/react";
import { BiTime } from "react-icons/bi";
import { GrView } from "react-icons/gr";
import { BiSolidUserCircle } from "react-icons/bi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaPercentage } from "react-icons/fa";
import useAlert from "../stores/useAlert";
type _re = { success: false; data: string } | { success: true; data: Video };

function Video() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [access_model, set_access_model] = useState<
    "open" | "exclusive" | null
  >(null);
  const [thumbnail, set_thumbnail] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [video, setVideo] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [commercial, setCommerical] = useState<string>("");
  const [derivation, setDerivation] = useState<string>("");
  const [creator, setCreator] = useState<string>("");
  const [view, setView] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const _setDescription = useAlert((state) => state.setDescription);
  const setOpen = useAlert((state) => state.setOpen);
  const _setTitle = useAlert((state) => state.setTile);
  const search = useCallback(
    async (id: string) => {
      const query = new Query({ url: "https://node2.irys.xyz/graphql" });
      const data = await query.search("irys:transactions").ids([id]);
      if (data.length && data[0].tags.length) {
        const tag = data[0].tags;
        for (let a = 0; a < tag.length; a++) {
          if (tag[a].name === "Access-Model") {
            if (tag[a].value === "open") {
              set_access_model("open");
              const data = await axios.get(`https://gateway.irys.xyz/${id}`, {
                maxRedirects: 4,
              });
              if (data.data) {
                setVideo(data.data);
              }
            } else {
              set_access_model("exclusive");
            }
          }
          if (tag[a].name === "Thumbnail") {
            //
            const data = await axios.get(
              `https://gateway.irys.xyz/${tag[a].value}`,
              { maxRedirects: 4 }
            );
            if (data.data) {
              set_thumbnail(data.data);
            }
          }
          if (tag[a].name === "Title") {
            setTitle(tag[a].value);
          }
          if (tag[a].name === "Description") {
            setDescription(tag[a].value);
          }
          if (tag[a].name === "Commerical-Use") {
            setCommerical(tag[a].value);
          }
          if (tag[a].name === "Derivation") {
            setDerivation(tag[a].value);
          }
          if (tag[a].name === "Playlist-Id") {
            if (tag[a].value === "None") {
              const contract = await get_dummy_contract();
              const data = await contract.viewState<
                { function: string; id: string },
                _re
              >({
                function: "get_video",
                id: id,
              });
              if (data.result.success) {
                setCreator(data.result.data.creator);
                setView(String(data.result.data.views));
                setTime(String(data.result.data.timestamp));
              }
            }
          }
        }
      } else {
        _setTitle("Error");
        _setDescription([]);
        _setDescription(["Cannot find your content"]);
        setOpen(true);
      }
    },
    [_setDescription, _setTitle, setOpen]
  );
  useEffect(() => {
    if (id?.length) {
      search(id);
    } else {
      navigate("/");
    }
    if (video.length) {
      const binaryString = atob(video);
      const binaryData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryData[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([binaryData], { type: "video/mp4" });
      const videoURL = URL.createObjectURL(blob);
      console.log(videoURL);
      setUrl(videoURL);
    }
    if (access_model === "exclusive") {
      _setDescription([]);
      _setTitle("Warning");
      setOpen(true);
    }
  }, [
    id,
    navigate,
    video,
    access_model,
    _setDescription,
    _setTitle,
    setOpen,
    search,
  ]);

  return (
    <>
      <NavBar />
      <div className="flex flex-col">
        <div className="items-center justify-center flex flex-col">
          <div className="aspect-video w-1/2">
            <VideoPlayer url={url} thumbnail={thumbnail} />
          </div>
        </div>
        <div className="items-center flex justify-center">
          <div className="mt-2 justify-start space-y-2 flex flex-col items-center w-1/2">
            <h1 className="text-4xl font-bold ">{title}</h1>
            <Accordion variant="bordered" className="mt-3">
              <AccordionItem
                key="1"
                subtitle="Click to expand"
                title={"Details"}
              >
                <StartCom
                  view={view}
                  time={time}
                  creator={creator}
                  commerical={commercial}
                  derv={derivation}
                />

                <p className="mb-3 text-gray-500 dark:text-gray-400 mt-3 first-letter:text-7xl first-letter:font-bold first-letter:text-gray-900 dark:first-letter:text-gray-100 first-letter:mr-3 first-letter:float-left">
                  {description}
                </p>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}

export default Video;
interface arg {
  view: string;
  time: string;
  creator: string;
  commerical: string;
  derv: string;
}
function StartCom(arg: arg) {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-row space-x-2">
        <Chip color="warning" startContent={<BiTime />}>
          {new Date(Number(arg.time) * 1000).toLocaleString()}
        </Chip>
        <Chip color="secondary" startContent={<GrView />} radius="sm">
          {arg.view}{" "}
        </Chip>
        <Chip color="danger" startContent={<BiSolidUserCircle />}>
          {arg.creator}
        </Chip>
      </div>
      <div className="flex flex-row space-x-2">
        <Chip color="primary" startContent={<AiOutlineDollarCircle />}>
          Commerical-Use: {arg.commerical}
        </Chip>
        <Chip color="success" startContent={<FaPercentage />}>
          Derivation: {arg.derv}
        </Chip>
      </div>
    </div>
  );
}
