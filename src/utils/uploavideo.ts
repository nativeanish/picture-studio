import useAddress from "../stores/useAddress";
import useAlert from "../stores/useAlert";
import useUserData from "../stores/useUserData";
import useVideo from "../stores/useVideo";
import { getArweaveConfig } from "./arweave";
import {
  getCommercial,
  getDerivation,
  isCommericalType,
  isDerivationType,
} from "./getComandDer";
export function upload_video() {
  _upload_video()
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}
async function _upload_video() {
  const _video = useVideo.getState();
  const title = _video.title;
  const description = _video.description;
  const tags = _video.tags;
  const thumbnail = _video.thumbnail;
  const setOpen = useAlert.getState().setOpen;
  const setDescription = useAlert.getState().setDescription;
  const video = _video.unecrypted_video;
  const _arweave = getArweaveConfig();
  const address = useAddress.getState().address
    ? useAddress.getState().address
    : "";
  if (
    title.length &&
    description.length &&
    tags.length &&
    thumbnail.length &&
    video?.length
  ) {
    const playlist = _video.selected_playlist;
    if (playlist === "none") {
      const accesss = _video.access;
      const commerical = _video.commerical;
      const derivation = _video.derivation;

      if (isCommericalType(commerical)) {
        if (isDerivationType(derivation)) {
          if (accesss === "exclusive") {
            const crypto = await encrypt(video);
            const transcation = await _arweave.createTransaction(
              {
                data: crypto.data,
              },
              "use_wallet"
            );
            transcation.addTag("Content-Type", "base64");
            transcation.addTag("Title", title);
            transcation.addTag("Tags", JSON.stringify(tags));
            transcation.addTag(
              "License",
              "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8"
            );
            transcation.addTag("Playlist-Id", "None");
            transcation.addTag("Commerical-Use", getCommercial(commerical));
            transcation.addTag("Derivation", getDerivation(derivation));
            transcation.addTag("Description", description);
            transcation.addTag("Access-Model", accesss);
            const price = _video.price;
            if (Number(price) > 0) {
              transcation.addTag("License-Fee", price);
              transcation.addTag("Currency", "Arweave");
              transcation.addTag(
                "Payment-Address",
                address?.length ? address : ""
              );
              const _thumbnail = await _arweave.createTransaction(
                {
                  data: thumbnail,
                },
                "use_wallet"
              );
              _thumbnail.addTag("Content-Type", "base64");
              _thumbnail.addTag("Video-id", transcation.id);
              await _arweave.transactions.sign(_thumbnail, "use_wallet");
              await _arweave.transactions.post(_thumbnail);
              if (_thumbnail.id) {
                transcation.addTag("Thumbnail", _thumbnail.id);
                await _arweave.transactions.sign(transcation, "use_wallet");
                await _arweave.transactions.post(transcation);
                console.log(`Uploaded: ${transcation.id}`);
                console.log(crypto.iv);
                console.log(crypto.key);
              }
            } else {
              setDescription(["Price should be Greater than 0 and numeric"]);
              setOpen(true);
            }
          } else if (accesss === "open") {
            const transcation = await _arweave.createTransaction(
              {
                data: video,
              },
              "use_wallet"
            );
            transcation.addTag("Content-Type", "base64");
            transcation.addTag("Title", title);
            transcation.addTag("Tags", JSON.stringify(tags));
            transcation.addTag(
              "License",
              "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8"
            );
            transcation.addTag("Playlist-Id", "None");
            transcation.addTag("Commerical-Use", getCommercial(commerical));
            transcation.addTag("Derivation", getDerivation(derivation));
            transcation.addTag("Access-Model", accesss);
            transcation.addTag("Description", description);
            const _thumbnail = await _arweave.createTransaction(
              {
                data: thumbnail,
              },
              "use_wallet"
            );
            _thumbnail.addTag("Content-Type", "base64");
            _thumbnail.addTag("Video-id", transcation.id);
            await _arweave.transactions.sign(_thumbnail, "use_wallet");
            const uploader = await _arweave.transactions.getUploader(
              _thumbnail
            );

            while (!uploader.isComplete) {
              await uploader.uploadChunk();
              console.log(
                `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
              );
            }
            if (_thumbnail.id) {
              transcation.addTag("Thumbnail", _thumbnail.id);
              await _arweave.transactions.sign(transcation, "use_wallet");
              console.log(`Uploaded: ${transcation.id}`);
              const uploader = await _arweave.transactions.getUploader(
                transcation
              );

              while (!uploader.isComplete) {
                await uploader.uploadChunk();
                console.log(
                  `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
                );
              }
            }
          } else {
            setDescription(["Access Type is undefined"]);
            setOpen(true);
          }
        } else {
          setDescription(["Derivation Type is undefined"]);
          setOpen(true);
        }
      } else {
        setDescription(["Commericial Type is undefined"]);
        setOpen(true);
      }
    } else {
      const _playlist = useUserData
        .getState()
        .playlist.find((e) => e.id === playlist);
      if (_playlist?.id) {
        if (_playlist.access_model === "exclusive") {
          const crypto = await encrypt(video);
          const transcation = await _arweave.createTransaction(
            {
              data: crypto.data,
            },
            "use_wallet"
          );
          transcation.addTag("Content-Type", "base64");
          transcation.addTag("Title", title);
          transcation.addTag("Tags", JSON.stringify(tags));
          transcation.addTag(
            "License",
            "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8"
          );
          transcation.addTag("Description", description);
          transcation.addTag("Playlist-Id", _playlist.id);
          const _thumbnail = await _arweave.createTransaction(
            {
              data: thumbnail,
            },
            "use_wallet"
          );
          _thumbnail.addTag("Content-Type", "base64");
          _thumbnail.addTag("Video-id", transcation.id);
          await _arweave.transactions.sign(_thumbnail, "use_wallet");
          await _arweave.transactions.post(_thumbnail);
          if (_thumbnail.id) {
            transcation.addTag("Thumbnail", _thumbnail.id);
            await _arweave.transactions.sign(transcation, "use_wallet");
            await _arweave.transactions.post(transcation);
            console.log(`Uploaded: ${transcation.id}`);
            console.log(crypto.iv);
            console.log(crypto.key);
          }
        } else {
          const transcation = await _arweave.createTransaction(
            {
              data: video,
            },
            "use_wallet"
          );
          transcation.addTag("Content-Type", "base64");
          transcation.addTag("Title", title);
          transcation.addTag("Tags", JSON.stringify(tags));
          transcation.addTag(
            "License",
            "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8"
          );
          transcation.addTag("Description", description);
          transcation.addTag("Playlist-Id", _playlist.id);
          const _thumbnail = await _arweave.createTransaction(
            {
              data: thumbnail,
            },
            "use_wallet"
          );
          _thumbnail.addTag("Content-Type", "base64");
          _thumbnail.addTag("Video-id", transcation.id);
          await _arweave.transactions.sign(_thumbnail, "use_wallet");
          await _arweave.transactions.post(_thumbnail);
          if (_thumbnail.id) {
            transcation.addTag("Thumbnail", _thumbnail.id);
            await _arweave.transactions.sign(transcation, "use_wallet");
            await _arweave.transactions.post(transcation);
            console.log(`Uploaded: ${transcation.id}`);
          }
        }
      } else {
        setDescription(["Cannot Find Playlist"]);
        setOpen(true);
      }
    }
  } else {
    const error = [];
    if (!video?.length) {
      error.push("Video is Missing");
    }
    if (!title.length) {
      error.push("Title is missing");
    }
    if (!description.length) {
      error.push("Description is missing");
    }
    if (!tags.length) {
      error.push("Tags is missing, Remove all the tags and add again");
    }
    if (!thumbnail.length) {
      error.push("Thumbnail is missing");
    }
    setDescription(error);
    setOpen(true);
  }
}
export async function encrypt(_data: string): Promise<{
  iv: Uint8Array;
  key: JsonWebKey;
  data: ArrayBuffer;
}> {
  const iv = await window.crypto.getRandomValues(new Uint8Array(12));
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  const encoder = new TextEncoder();
  const data = encoder.encode(_data);
  const _encrypted_data = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );
  const json_key = await window.crypto.subtle.exportKey("jwk", key);
  return { iv: iv, key: json_key, data: _encrypted_data };
}
