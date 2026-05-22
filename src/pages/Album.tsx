import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useSongData } from "../context/SongContext";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { FaBookmark, FaPlay, FaRegBookmark } from "react-icons/fa";
import { useUserData } from "../context/UserContext";

const Album = () => {
  const {
    fetchAlbumsSongs,
    albumSong,
    albumData,
    setIsPlaying,
    setSelectedSong,
    loading,
  } = useSongData();

  const { isAuth, addToPlayList } = useUserData();
  const params = useParams<{ id: string }>();

  const [activeSong, setActiveSong] = useState<string | null>(null);
  const [savedSongs, setSavedSongs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (params.id) {
      fetchAlbumsSongs(params.id);
    }
  }, [params.id, fetchAlbumsSongs]);

  const handlePlay = (songId: string) => {
    setActiveSong(songId);
    setSelectedSong(songId);
    setIsPlaying(true);
  };

  const handleBookmark = (songId: string) => {
    addToPlayList(songId);

    setSavedSongs((prev) => {
      const next = new Set(prev);

      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }

      return next;
    });
  };

  return (
    <div>
      <Layout>
        {albumData && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <div className="px-3 md:px-6 py-6 pb-32">
                {/* ── Album Hero ── */}
                <div
                  className="relative rounded-2xl overflow-hidden mb-8 p-5 md:p-8 flex flex-col md:flex-row gap-5 md:gap-8 md:items-end"
                  style={{
                    background:
                      "linear-gradient(180deg, #1f1f1f 0%, #121212 100%)",
                  }}
                >
                  {/* Subtle top glow */}
                  <div
                    className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(29,185,84,0.08) 0%, transparent 100%)",
                    }}
                  />

                  {/* Thumbnail */}
                  {albumData.thumbnail ? (
                    <div className="relative flex-shrink-0 self-center md:self-auto">
                      <img
                        src={albumData.thumbnail}
                        className="w-36 h-36 md:w-52 md:h-52 rounded-lg object-cover"
                        style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.7)" }}
                        alt={albumData.title}
                      />
                    </div>
                  ) : (
                    <div
                      className="w-36 h-36 md:w-52 md:h-52 rounded-lg flex-shrink-0 flex items-center justify-center text-5xl self-center md:self-auto"
                      style={{
                        background: "#282828",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
                      }}
                    >
                      🎵
                    </div>
                  )}

                  {/* Meta */}
                  <div className="relative z-10 flex flex-col gap-2 md:gap-3 text-center md:text-left items-center md:items-start">
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: "#b3b3b3" }}
                    >
                      Playlist
                    </span>
                    <h1
                      className="text-3xl md:text-5xl font-black leading-tight"
                      style={{ color: "#fff", letterSpacing: "-0.5px" }}
                    >
                      {albumData.title}
                    </h1>
                    <p
                      className="text-sm max-w-md"
                      style={{ color: "#b3b3b3", lineHeight: 1.6 }}
                    >
                      {albumData.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src="/logo.webp"
                        alt="Logo"
                        className="w-5 h-5 rounded-full"
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#fff" }}
                      >
                        {albumSong?.length ?? 0}
                        <span style={{ color: "#b3b3b3" }}> songs</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Play All Button (mobile) ── */}
                <div className="flex items-center gap-4 mb-4 px-2 md:hidden">
                  <button
                    onClick={() =>
                      albumSong?.length && handlePlay(albumSong[0].id)
                    }
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
                    style={{ background: "#1DB954" }}
                  >
                    <FaPlay size={16} color="#000" style={{ marginLeft: 3 }} />
                  </button>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#b3b3b3" }}
                  >
                    Play all
                  </span>
                </div>

                {/* ── Tracklist Header — desktop only ── */}
                <div
                  className="hidden md:grid gap-4 px-4 pb-3 mb-1 text-xs font-semibold tracking-widest uppercase"
                  style={{
                    gridTemplateColumns: "40px 1fr 1fr 90px",
                    color: "#b3b3b3",
                    borderBottom: "1px solid #282828",
                  }}
                >
                  <span className="text-center">#</span>
                  <span>Title</span>
                  <span>Description</span>
                  <span className="text-center">Actions</span>
                </div>

                {/* ── Song Rows ── */}
                <div className="flex flex-col mt-1">
                  {albumSong &&
                    albumSong.map((song, index) => {
                      const isActive = activeSong === song.id;
                      const isSaved = savedSongs.has(song.id);

                      return (
                        <div
                          key={song.id}
                          onClick={() => handlePlay(song.id)}
                          className="group cursor-pointer rounded-md transition-colors duration-150"
                          style={{
                            background: isActive
                              ? "rgba(255,255,255,0.1)"
                              : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive)
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = "rgba(255,255,255,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive)
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = "transparent";
                          }}
                        >
                          {/* ── DESKTOP ROW ── */}
                          <div
                            className="hidden md:grid items-center gap-4 px-4 py-2"
                            style={{ gridTemplateColumns: "40px 1fr 1fr 90px" }}
                          >
                            {/* Index / playing indicator */}
                            <div className="flex items-center justify-center">
                              {isActive ? (
                                <span
                                  style={{
                                    color: "#1DB954",
                                    fontSize: 13,
                                    fontWeight: 600,
                                  }}
                                >
                                  ▶
                                </span>
                              ) : (
                                <span
                                  className="text-sm tabular-nums group-hover:hidden block"
                                  style={{ color: "#b3b3b3" }}
                                >
                                  {index + 1}
                                </span>
                              )}
                              {!isActive && (
                                <span
                                  className="text-sm hidden group-hover:block"
                                  style={{ color: "#fff" }}
                                >
                                  <FaPlay size={12} />
                                </span>
                              )}
                            </div>

                            {/* Thumbnail + Title */}
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={
                                  song.thumbnail
                                    ? song.thumbnail
                                    : "/custum thumbnail.webp"
                                }
                                className="w-10 h-10 rounded object-cover flex-shrink-0"
                                alt={song.title}
                              />
                              <span
                                className="text-sm font-medium truncate"
                                style={{ color: isActive ? "#1DB954" : "#fff" }}
                              >
                                {song.title}
                              </span>
                            </div>

                            {/* Description */}
                            <p
                              className="text-sm truncate"
                              style={{ color: "#b3b3b3" }}
                            >
                              {song.description.slice(0, 40)}...
                            </p>

                            {/* Actions */}
                            <div
                              className="flex items-center justify-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {isAuth && (
                                <button
                                  title={isSaved ? "Saved" : "Save"}
                                  onClick={() => handleBookmark(song.id)}
                                  className="transition-all duration-150 p-1.5 rounded"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: isSaved ? "#1DB954" : "#b3b3b3",
                                  }}
                                  onMouseEnter={(e) =>
                                    ((
                                      e.currentTarget as HTMLElement
                                    ).style.color = "#1DB954")
                                  }
                                  onMouseLeave={(e) =>
                                    ((
                                      e.currentTarget as HTMLElement
                                    ).style.color = isSaved
                                      ? "#1DB954"
                                      : "#b3b3b3")
                                  }
                                >
                                  {isSaved ? (
                                    <FaBookmark size={14} />
                                  ) : (
                                    <FaRegBookmark size={14} />
                                  )}
                                </button>
                              )}

                              <button
                                title="Play"
                                onClick={() => handlePlay(song.id)}
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95"
                                style={{
                                  background: isActive
                                    ? "#1DB954"
                                    : "rgba(255,255,255,0.1)",
                                  border: "none",
                                  cursor: "pointer",
                                  color: isActive ? "#000" : "#fff",
                                }}
                                onMouseEnter={(e) => {
                                  (
                                    e.currentTarget as HTMLElement
                                  ).style.background = "#1DB954";
                                  (e.currentTarget as HTMLElement).style.color =
                                    "#000";
                                  (
                                    e.currentTarget as HTMLElement
                                  ).style.transform = "scale(1.1)";
                                }}
                                onMouseLeave={(e) => {
                                  (
                                    e.currentTarget as HTMLElement
                                  ).style.background = isActive
                                    ? "#1DB954"
                                    : "rgba(255,255,255,0.1)";
                                  (e.currentTarget as HTMLElement).style.color =
                                    isActive ? "#000" : "#fff";
                                  (
                                    e.currentTarget as HTMLElement
                                  ).style.transform = "scale(1)";
                                }}
                              >
                                <FaPlay size={11} style={{ marginLeft: 2 }} />
                              </button>
                            </div>
                          </div>

                          {/* ── MOBILE ROW ── */}
                          <div className="flex md:hidden items-center gap-3 px-2 py-3">
                            {/* Thumbnail */}
                            <div className="relative flex-shrink-0">
                              <img
                                src={
                                  song.thumbnail
                                    ? song.thumbnail
                                    : "/custum thumbnail.webp"
                                }
                                className="w-12 h-12 rounded object-cover"
                                alt={song.title}
                              />
                              {isActive && (
                                <div
                                  className="absolute inset-0 rounded flex items-center justify-center"
                                  style={{ background: "rgba(0,0,0,0.5)" }}
                                >
                                  <span
                                    style={{ color: "#1DB954", fontSize: 12 }}
                                  >
                                    ▶
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Title + desc */}
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-medium truncate"
                                style={{ color: isActive ? "#1DB954" : "#fff" }}
                              >
                                {song.title}
                              </p>
                              <p
                                className="text-xs truncate mt-0.5"
                                style={{ color: "#b3b3b3" }}
                              >
                                {song.description.slice(0, 30)}...
                              </p>
                            </div>

                            {/* Actions */}
                            <div
                              className="flex items-center gap-2 flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {isAuth && (
                                <button
                                  onClick={() => handleBookmark(song.id)}
                                  className="p-2"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: isSaved ? "#1DB954" : "#b3b3b3",
                                  }}
                                >
                                  {isSaved ? (
                                    <FaBookmark size={14} />
                                  ) : (
                                    <FaRegBookmark size={14} />
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => handlePlay(song.id)}
                                className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95"
                                style={{
                                  background: isActive
                                    ? "#1DB954"
                                    : "rgba(255,255,255,0.1)",
                                  border: "none",
                                  cursor: "pointer",
                                  color: isActive ? "#000" : "#fff",
                                }}
                              >
                                <FaPlay size={12} style={{ marginLeft: 2 }} />
                              </button>
                            </div>
                          </div>

                          {/* Divider — mobile only */}
                          <div
                            className="md:hidden mx-3"
                            style={{ borderBottom: "1px solid #282828" }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        )}
      </Layout>
    </div>
  );
};

export default Album;
