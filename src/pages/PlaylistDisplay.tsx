import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Query from "@irys/query";
import axios from "axios";
import { get_dummy_contract } from "../utils/getWarp";
import NavBar from "../components/NavBar";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
} from "@nextui-org/react";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaPercentage } from "react-icons/fa";
import { BiSolidUserCircle, BiTime } from "react-icons/bi";
type _type =
  | { success: true; data: Playlist }
  | { success: false; data: string };
type _v_type = {
  title: string;
  description: string;
  thumbnail: string;
  id: string;
};
function PlaylistDisplay() {
  const { id } = useParams();
  const [thumbnail, set_thumbnail] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [commercial, setCommerical] = useState<string>("");
  const [derivation, setDerivation] = useState<string>("");
  const [creator, setCreator] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [access_model, set_access_model] = useState<
    "open" | "exclusive" | null
  >(null);
  const [video, setVideo] = useState<Array<string>>([]);
  const [detail_video, set_detail_video] = useState<Array<_v_type>>([]);
  const navigate = useNavigate();
  const search = useCallback(async (id: string) => {
    const query = new Query({ url: "https://node2.irys.xyz/graphql" });
    const data = await query.search("irys:transactions").ids([id]);
    if (data.length && data[0].tags.length) {
      const tag = data[0].tags;
      const _data = await axios.get(`https://gateway.irys.xyz/${id}`, {
        maxRedirects: 4,
      });
      if (_data.data) {
        set_thumbnail(_data.data);
      }
      for (let a = 0; a < tag.length; a++) {
        if (tag[a].name === "Access-Model") {
          if (tag[a].value === "open") {
            set_access_model("open");
          }
          if (tag[a].value === "exclusive") {
            set_access_model("exclusive");
          }
          const contract = await get_dummy_contract();
          const data = await contract.viewState<
            { function: string; id: string },
            _type
          >({
            function: "get_playlist",
            id: id,
          });
          if (data.result.success) {
            setTime(data.result.data.timestamp);
            setCreator(data.result.data.creator);
            setVideo(data.result.data.video_list);
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
      }
    }
  }, []);
  const video_search = useCallback(async () => {
    for (let a = 0; a < video.length; a++) {
      const query = new Query({ url: "https://node2.irys.xyz/graphql" });
      const data = await query.search("irys:transactions").ids([video[a]]);
      if (data.length && data[0].tags.length) {
        const _tag = data[0].tags;
        const _temp_Video: _v_type = {
          title: "",
          description: "",
          thumbnail: "",
          id: "",
        };
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
        set_detail_video([
          ...detail_video,
          {
            id: video[a],
            title: _temp_Video.title,
            thumbnail: _temp_Video.thumbnail,
            description: _temp_Video.description,
          },
        ]);
      }
    }
  }, [video, detail_video]);
  useEffect(() => {
    if (id?.length) {
      if (!title.length) {
        search(id);
      }
    } else {
      navigate("/");
    }
    if (video.length && !detail_video.length) {
      video_search();
    }
  }, [detail_video, id, navigate, search, title.length, video, video_search]);
  return (
    <div>
      <NavBar />
      <div className="flex flex-col">
        <div className="items-center justify-center flex">
          <div className="aspect-video w-1/2 mt-3">
            <Card
              isFooterBlurred
              className="w-full h-full col-span-12 sm:col-span-5"
            >
              <CardHeader className="absolute flex-col items-start bg-white/40  border-zinc-100/50">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  {title}
                </p>
                <h4 className="text-black font-medium text-xl">
                  {description}
                </h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src={thumbnail}
              />
              <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div className="space-x-1 space-y-2">
                  <Chip
                    color="primary"
                    startContent={<AiOutlineDollarCircle />}
                  >
                    {commercial}
                  </Chip>
                  <Chip color="secondary" startContent={<FaPercentage />}>
                    {derivation}
                  </Chip>
                  <Chip color="success" startContent={<BiSolidUserCircle />}>
                    {creator}
                  </Chip>
                  <Chip color="warning" startContent={<BiTime />}>
                    {new Date(parseInt(time) * 1000).toLocaleString()}
                  </Chip>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        {detail_video.length ? (
          <>
            <div className="items-center justify-center flex mt-5">
              <div className="relative border-2 border-gradient p-4 rounded-lg">
                <h2 className="absolute top-0 left-0 bg-white px-2 -mt-4 text-red-500 font-bold">
                  Video
                </h2>
                <div className="flex items-center  justify-center flex-wrap gap-4">
                  {detail_video.map((e, i) => (
                    <Video
                      key={i}
                      thumbnail={e.thumbnail}
                      title={e.title}
                      playlist={id?.length ? id : ""}
                      id={e.id}
                    />
                  ))}
                </div>
              </div>
            </div>{" "}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default PlaylistDisplay;
interface argu {
  thumbnail: string;
  title: string;
  playlist: string;
  id: string;
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
        </CardFooter>
      </Card>
    </>
  );
}
