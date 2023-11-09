import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Query from "@irys/query";
import axios from "axios";
import get_contract, { get_dummy_contract } from "../utils/getWarp";
import VideoPlayer from "../components/VideoPlayer";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import useAlert from "../stores/useAlert";
import StartCom from "../components/StartCom";
import useAddress from "../stores/useAddress";
import { decrypt } from "../utils/crypto";
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
  const address = useAddress((state) => state.address);
  const [bought, set_bought] = useState<boolean | null>(null);
  const [price, setPrice] = useState<string>("");
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
  const check_and_get = useCallback(async (id: string, address: string) => {
    const contract = await get_dummy_contract();
    const state = (await contract.readState()).cachedValue.state.bought;
    const filter = state.filter(
      (e) => e.id === id && e.type === "video" && e.user === address
    );
    if (filter.length) {
      set_bought(true);
      const data = await axios.get(
        `http://localhost:8080/get/${id}/${address}`,
        { maxRedirects: 4 }
      );
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
    } else {
      set_bought(false);
      const query = new Query({ url: "https://node2.irys.xyz/graphql" });
      const data = await query.search("irys:transactions").ids([id]);
      const _data = data[0].tags.find((e) => e.name === "License-Fee");
      if (_data?.value.length) {
        setPrice(_data.value);
      }
    }
  }, []);
  const buy = async () => {
    if (address?.length && id?.length) {
      const query = new Query({ url: "https://node2.irys.xyz/graphql" });
      const data = await query.search("irys:transactions").ids([id]);
      const tags = data[0].tags;
      const licensefee = tags.find((e) => e.name === "License-Fee");
      const paymentaddress = tags.find((e) => e.name === "Payment-Address");
      if (licensefee?.value.length && paymentaddress?.value.length) {
        const contract = await get_contract();
        try {
          const data = await contract.writeInteraction(
            { function: "buy", id: id, type: "video" },
            {
              transfer: {
                target: paymentaddress.value,
                winstonQty: licensefee.value,
              },
            }
          );
          if (data?.interactionTx.id) {
            window.location.reload();
          }
        } catch (err) {
          _setTitle("Error");
          _setDescription([`Error Happened: ${err}`]);
          setOpen(true);
        }
      }
    }
  };
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
      if (!address?.length) {
        _setTitle("Warning");
        _setDescription([]);
        _setDescription(["Please Login to Watch this video"]);
        setOpen(true);
        return;
      } else {
        if (id && address.length) {
          check_and_get(id, address);
        }
      }
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
    address,
    check_and_get,
  ]);

  return (
    <>
      <NavBar />
      <div className="flex flex-col">
        <div className="items-center justify-center flex flex-col">
          {access_model === "exclusive" && bought === false ? (
            <>
              <Button
                onClick={() =>
                  buy()
                    .then()
                    .catch((err) => console.log(err))
                }
                className="mt-3"
                color="danger"
                size="lg"
              >
                Buy this video @{" "}
                {price.length ? (
                  <>{String(Number(price) / 1000000000000)} AR</>
                ) : null}
              </Button>
            </>
          ) : (
            <div className="aspect-video w-1/2">
              <VideoPlayer url={url} thumbnail={thumbnail} />
            </div>
          )}
        </div>
        <div className="items-center flex justify-center mt-2">
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
