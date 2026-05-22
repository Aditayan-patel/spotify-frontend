import React, { useEffect, useRef, useState } from "react";
import { useSongData } from "../context/SongContext";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    isPlaying,
    setIsPlaying,
    prevSong,
    nextSong,
  } = useSongData();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [volume, setVolume] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // BUG FIX 1: isPlayingRef — canplay listener ke andar fresh value milegi
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Audio events: metadata, timeupdate, ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleTimeUpdate = () => setProgress(audio.currentTime || 0);
    const handleEnded = () => nextSong();

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [song, nextSong]);

  // BUG FIX 2: selectedSong change hone pe fetch karo — lekin sirf jab selectedSong truthy ho
  useEffect(() => {
    if (selectedSong) {
      fetchSingleSong();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSong]);

  // BUG FIX 1 (continued): Naya song load hone par — ref se isPlaying check karo (stale closure avoid)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    setProgress(0);

    const handleCanPlay = async () => {
      if (isPlayingRef.current) {
        try {
          await audio.play();
        } catch (error) {
          console.error("Auto-play error:", error);
        }
      }
    };

    audio.addEventListener("canplay", handleCanPlay);
    return () => audio.removeEventListener("canplay", handleCanPlay);
  }, [song]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handelPlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio play error:", error);
    }
  };

  const volumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !duration) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!song) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Main Player */}
      <div
        className="
          h-[70px] md:h-[6vw]
          w-full
          bg-gradient-to-r from-zinc-950 via-zinc-900 to-black
          border-t border-white/10
          backdrop-blur-xl
          shadow-[0_-8px_30px_rgba(0,0,0,0.6)]
          text-white
          px-4 md:px-6
          flex items-center
          overflow-hidden
        "
      >
        {/* Audio element — key prop forces remount on new song src */}
        {song.audio && (
          <audio ref={audioRef} src={song.audio}  />
        )}

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex md:hidden w-full items-center">
          <div className="flex-shrink-0">
            <img
              src={song.thumbnail || "/custum thumbnail.webp"}
              alt={song.title}
              className="w-11 h-11 rounded-lg object-cover shadow-lg"
            />
          </div>

          <div className="flex-1 flex justify-center items-center gap-5">
            <button
              onClick={prevSong}
              className="text-zinc-400 hover:text-white transition active:scale-90"
            >
              <GrChapterPrevious size={18} />
            </button>

            <button
              onClick={handelPlayPause}
              className="
                w-10 h-10 rounded-full bg-white text-black
                flex items-center justify-center
                shadow-lg hover:scale-105 active:scale-95
                transition-all duration-200
              "
            >
              {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
            </button>

            <button
              onClick={nextSong}
              className="text-zinc-400 hover:text-white transition active:scale-90"
            >
              <GrChapterNext size={18} />
            </button>
          </div>

          <div className="flex-shrink-0 w-11" />
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden md:flex w-full items-center">
          {/* Left: Song Info */}
          <div className="flex items-center gap-3 w-[30%] min-w-0">
            <img
              src={song.thumbnail || "/custum thumbnail.webp"}
              alt={song.title}
              className="w-14 h-14 rounded-xl object-cover shadow-lg flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{song.title}</p>
              <p className="text-xs text-zinc-400 truncate">
                {song.description?.slice(0, 30) || "Unknown Artist"}
              </p>
            </div>
          </div>

          {/* Center: Controls + Progress */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={prevSong}
                className="text-zinc-400 hover:text-white transition"
              >
                <GrChapterPrevious size={18} />
              </button>

              <button
                onClick={handelPlayPause}
                className="
                  w-12 h-12 rounded-full bg-white text-black
                  flex items-center justify-center
                  shadow-lg hover:scale-105 active:scale-95
                  transition-all duration-200
                "
              >
                {isPlaying ? (
                  <FaPause size={16} />
                ) : (
                  <FaPlay size={16} className="ml-0.5" />
                )}
              </button>

              <button
                onClick={nextSong}
                className="text-zinc-400 hover:text-white transition"
              >
                <GrChapterNext size={18} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full max-w-xl mt-1 min-w-0">
              <span className="text-xs text-zinc-400 w-10 text-right">
                {formatTime(progress)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={(duration > 0 ? (progress / duration) * 100 : 0)}
                onChange={durationChange}
                className="
                  flex-1 min-w-0 h-1 rounded-full
                  accent-green-500 bg-zinc-700
                  cursor-pointer appearance-none transition-all duration-150
                "
              />
              <span className="text-xs text-zinc-400 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Volume */}
          <div className="flex items-center justify-end gap-3 w-[30%]">
            <button
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
              className="text-zinc-400 hover:text-white transition"
            >
              {volume === 0 ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={volumeChange}
              className="
                w-28 h-1 rounded-full
                accent-green-600 bg-green-400
                cursor-pointer appearance-none
              "
            />
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden bg-black/95 px-3 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 w-8 text-right">
            {formatTime(progress)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={(duration > 0 ? (progress / duration) * 100 : 0)}
            onChange={durationChange}
            className="
              flex-1 h-1 rounded-full
              accent-green-500 bg-zinc-700
              cursor-pointer appearance-none
            "
          />
          <span className="text-[10px] text-zinc-500 w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Player;