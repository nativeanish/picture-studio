import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useCallback, useEffect, useState } from "react";
import { get_dummy_contract } from "../utils/getWarp";
import axios from "axios";
import Query from "@irys/query";
import VideoPlayer from "../components/VideoPlayer";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardFooter,
  Image,
} from "@nextui-org/react";
import StartCom from "../components/StartCom";
import useAddress from "../stores/useAddress";
import useAlert from "../stores/useAlert";
import { decrypt } from "../utils/crypto";

type _p = { success: false; data: string } | { success: true; data: Playlist };
type _v_type = {
  title: string;
  description: string;
  thumbnail: string;
  id: string;
};
type _re = { success: false; data: string } | { success: true; data: Video };

function PlaylistVideo() {
  const { id, v_id } = useParams();
  const [detail_video, set_detail_video] = useState<Array<_v_type>>([]);
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
  const address = useAddress((state) => state.address);
  const _setDescription = useAlert((state) => state.setDescription);
  const setOpen = useAlert((state) => state.setOpen);
  const _setTitle = useAlert((state) => state.setTile);
  const get_playlist = useCallback(async (id: string, v_id: string) => {
    const contract = await get_dummy_contract();
    const query = new Query({ url: "https://node2.irys.xyz/graphql" });
    const data = await contract.viewState<{ function: string; id: string }, _p>(
      { function: "get_playlist", id: id }
    );
    if (data.result.success) {
      const _check_video_exits = data.result.data.video_list.filter(
        (e) => e === v_id
      );
      if (_check_video_exits.length) {
        set_access_model(data.result.data.access_model);
        const video = await axios.get(`https://gateway.irys.xyz/${v_id}`, {
          maxRedirects: 4,
        });
        setVideo(video.data);
        const playlist = await query.search("irys:transactions").ids([id]);
        const __tag = playlist[0].tags;
        if (__tag.length) {
          for (let c = 0; c < __tag.length; c++) {
            if (__tag[c].name === "Commerical-Use") {
              setCommerical(__tag[c].value);
            }
            if (__tag[c].name === "Derivation") {
              setDerivation(__tag[c].value);
            }
            if (__tag[c].name === "Access-Model") {
              if (__tag[c].value === "open") {
                set_access_model("open");
              }
              if (__tag[c].value === "exclusive") {
                set_access_model("exclusive");
              }
            }
          }
        }
        const _data = data.result.data.video_list;
        const ___data = await query.search("irys:transactions").ids([_data[0]]);
        if (___data.length && ___data[0].tags.length) {
          const tag = ___data[0].tags;
          for (let a = 0; a < tag.length; a++) {
            if (tag[a].name === "Thumbnail") {
              const data = await axios.get(
                `https://gateway.irys.xyz/${tag[a].value}`,
                { maxRedirects: 4 }
              );
              if (data.data) {
                set_thumbnail(data.data);
              }
            }
            if (tag[a].name === "Title") {
              console.log(tag[a].value);
              setTitle(tag[a].value);
            }
            if (tag[a].name === "Description") {
              setDescription(tag[a].value);
            }
            if (tag[a].name === "Playlist-Id") {
              if (tag[a].value === id) {
                const data = await contract.viewState<
                  { function: string; id: string },
                  _re
                >({
                  function: "get_video",
                  id: v_id,
                });
                if (data.result.success) {
                  setCreator(data.result.data.creator);
                  setView(String(data.result.data.views));
                  setTime(String(data.result.data.timestamp));
                }
              }
            }
          }
        }
        const _temp: Array<_v_type> = [];
        for (let a = 0; a < _data.length; a++) {
          const _temp_Video: _v_type = {
            title: "",
            description: "",
            thumbnail: "",
            id: "",
          };
          const _video_list_data = await query
            .search("irys:transactions")
            .ids([_data[a]]);
          const _tag = _video_list_data[0].tags;
          if (_video_list_data[0].tags.length) {
            for (let b = 0; b < _tag.length; b++) {
              if (_tag[b].name === "Thumbnail") {
                const data = await axios.get(
                  `https://gateway.irys.xyz/${_tag[b].value}`,
                  { maxRedirects: 4 }
                );
                if (data.data) {
                  _temp_Video.thumbnail = data.data;
                }
              }
              if (_tag[b].name === "Title") {
                _temp_Video.title = _tag[b].value;
              }
              if (_tag[b].name === "Description") {
                _temp_Video.description = _tag[b].value;
              }
            }

            _temp.push({
              id: _data[a],
              title: _temp_Video.title,
              thumbnail: _temp_Video.thumbnail,
              description: _temp_Video.description,
            });
          }
        }
        set_detail_video(_temp);
      }
    }
  }, []);
  const check_and_get = useCallback(async (id: string, address: string) => {
    const data = await axios.get(`http://localhost:8080/get/${id}/${address}`, {
      maxRedirects: 4,
    });
    if (data.data) {
      const _video = await axios.get(`https://gateway.irys.xyz/${id}`, {
        maxRedirects: 4,
      });
      const ___video = await decrypt(
        _video.data,
        JSON.parse(data.data.key),
        data.data.iv
      );
      setVideo(___video);
    }
  }, []);
  useEffect(() => {
    if (id?.length && v_id?.length && !video.length) {
      get_playlist(id, v_id);
    }
    if (video.length) {
      const binaryString = atob(video);
      const binaryData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryData[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([binaryData], { type: "video/mp4" });
      const videoURL = URL.createObjectURL(blob);
      setUrl(videoURL);
    }
    if (title && id && thumbnail) {
      const data = detail_video.filter((e) => e.id === v_id);
      if (data.length) {
        setTitle(data[0].title);
        set_thumbnail(data[0].thumbnail);
      }
    }
    if (access_model === "exclusive" && id?.length && v_id?.length) {
      if (!address?.length) {
        _setTitle("Warning");
        _setDescription(["Login to View"]);
        setOpen(true);
      } else {
        check_and_get(v_id, address);
      }
    }
  }, [
    id,
    v_id,
    video,
    get_playlist,
    thumbnail,
    detail_video,
    title,
    access_model,
    address,
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
        {detail_video.length && v_id ? (
          <>
            <div className="items-center justify-center flex mt-5">
              <div className="relative border-2 border-gradient p-4 rounded-lg">
                <h2 className="absolute top-0 left-0 bg-white px-2 -mt-4 text-red-500 font-bold">
                  Playlist Video
                </h2>
                <div className="flex items-center  justify-center flex-wrap gap-4">
                  {detail_video.map((e, i) => (
                    <Video
                      key={i}
                      thumbnail={e.thumbnail}
                      title={e.title}
                      playlist={id?.length ? id : ""}
                      id={e.id}
                      watching_id={v_id}
                    />
                  ))}
                </div>
              </div>
            </div>{" "}
          </>
        ) : null}
      </div>
    </>
  );
}

export default PlaylistVideo;
interface argu {
  thumbnail: string;
  title: string;
  playlist: string;
  id: string;
  watching_id: string;
}
function Video(arg: argu) {
  const navigate = useNavigate();
  return (
    <>
      <Card
        isFooterBlurred
        radius="lg"
        className="border-none h-44 aspect-video"
      >
        <Image
          alt="Woman listing to music"
          className="object-cover h-44 aspect-video"
          src={arg.thumbnail}
        />
        <CardFooter className="justify-between truncate before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-tiny text-white/80">{arg.title}</p>
          {arg.id === arg.watching_id ? (
            <Button
              className="text-tiny text-white bg-black/20"
              color="primary"
              radius="lg"
              size="sm"
              isDisabled
            >
              Watching
            </Button>
          ) : (
            <>
              <Button
                className="text-tiny text-white bg-black/20"
                variant="flat"
                color="default"
                radius="lg"
                size="sm"
                onClick={() => navigate(`/p/${arg.playlist}/v/${arg.id}`)}
              >
                View
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
