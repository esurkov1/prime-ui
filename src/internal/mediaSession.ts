import * as React from "react";

/**
 * One sound at a time: a voice message, a video message or a video in a chat. A media element
 * that starts playing with sound takes the session and pauses the one that held it, whatever its
 * kind. A muted or silent element (a looping preview) never takes it.
 */
let active: HTMLMediaElement | null = null;

const audible = (media: HTMLMediaElement) => !media.muted && media.volume > 0;

/** `media` started playing (or got its sound back while playing): it takes the session. */
function claimPlayback(media: HTMLMediaElement): void {
  if (!audible(media)) return;
  if (active && active !== media) active.pause();
  active = media;
}

/** `media` paused, ended or went away: the session is free. */
function releasePlayback(media: HTMLMediaElement): void {
  if (active === media) active = null;
}

/**
 * Registers a media element with the session: playing it with sound pauses whatever else plays.
 * Listens to the element itself, so native controls, `play()` from code and the kit's own buttons
 * all count.
 */
export function useMediaSession(ref: React.RefObject<HTMLMediaElement | null>): void {
  React.useEffect(() => {
    const media = ref.current;
    if (!media) return;
    const claim = () => claimPlayback(media);
    const release = () => releasePlayback(media);
    const volume = () => {
      if (!audible(media)) release();
      else if (!media.paused) claim();
    };
    media.addEventListener("play", claim);
    media.addEventListener("playing", claim);
    media.addEventListener("volumechange", volume);
    media.addEventListener("pause", release);
    media.addEventListener("ended", release);
    return () => {
      media.removeEventListener("play", claim);
      media.removeEventListener("playing", claim);
      media.removeEventListener("volumechange", volume);
      media.removeEventListener("pause", release);
      media.removeEventListener("ended", release);
      release();
    };
  }, [ref]);
}
