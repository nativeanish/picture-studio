import "@vidstack/react/player/styles/base.css";

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  type MediaProviderAdapter,
  MediaPlayerInstance,
} from "@vidstack/react";
import { useRef } from "react";
interface argu {
  url: string;
  poster?: string;
  alt?: string;
}
export function Player(argu: argu) {
  const ref = useRef<MediaPlayerInstance>(null);
  function onProviderChange(provider: MediaProviderAdapter | null) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  return (
    <MediaPlayer
      className="aspect-video bg-slate-900 text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4"
      title="Video Player"
      src={argu.url}
      crossorigin
      onProviderChange={onProviderChange}
      ref={ref}
      controls={true}
    >
      <MediaProvider>
        {argu.poster?.length ? (
          <Poster
            className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
            src={argu.poster}
            alt={argu.alt?.length ? argu.alt : "New Video Upload"}
          />
        ) : null}
      </MediaProvider>
    </MediaPlayer>
  );
}
