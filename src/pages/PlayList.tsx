import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSongData, type Song } from "../context/SongContext";
import { useUserData } from "../context/UserContext";
import { FaBookmark, FaPlay, FaRegBookmark } from "react-icons/fa";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

const PlayList = () => {
  const { songs, setIsPlaying, setSelectedSong, loading } = useSongData();
  const { user, addToPlayList } = useUserData();

  const [myPlayList, setMyPlayList] = useState<Song[]>([]);
  const [savedSongs, setSavedSongs] = useState<Set<string>>(new Set());
  const [activeSong, setActiveSong] = useState<string | null>(null);

  // PLAY SONG
  const handlePlay = (songId: string) => {
    setSelectedSong(songId);
    setIsPlaying(true);
    setActiveSong(songId);
  };

  // ADD / REMOVE PLAYLIST (WITH TOAST)
  const handleBookmark = async (songId: string) => {
    const isAlreadySaved = savedSongs.has(songId);

    // optimistic UI update
    setSavedSongs((prev) => {
      const next = new Set(prev);
      next.has(songId) ? next.delete(songId) : next.add(songId);
      return next;
    });

    try {
      await addToPlayList(songId);

      toast.success(
        isAlreadySaved
          ? "Removed from playlist ❌"
          : "Added to playlist ❤️"
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to update playlist");

      // rollback UI if API fails
      setSavedSongs((prev) => {
        const next = new Set(prev);
        next.has(songId) ? next.delete(songId) : next.add(songId);
        return next;
      });
    }
  };

  // FILTER USER PLAYLIST
  useEffect(() => {
    if (songs && user?.playlist?.length) {
      const filtered = songs.filter((song) =>
        user.playlist.includes(song.id.toString())
      );
      setMyPlayList(filtered);
    } else {
      setMyPlayList([]);
    }
  }, [songs, user]);

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="px-0 sm:px-4 md:px-8 py-6 pb-32 text-white">

          {/* HEADER */}
          <div className="relative overflow-hidden rounded-2xl p-5 md:p-10 mb-8 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/10">

            <div className="absolute inset-0 bg-green-500/10 blur-3xl" />

            <div className="relative z-10">
              <p className="text-xs tracking-widest uppercase text-zinc-400">
                Playlist
              </p>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2">
                {user?.name ? `${user.name}'s Playlist` : "My Playlist"}
              </h1>

              <p className="text-sm text-zinc-400 mt-2">
                Your favorite songs collection
              </p>

              <div className="mt-3 text-sm text-zinc-300">
                {myPlayList.length} songs
              </div>
            </div>
          </div>

          {/* SONG LIST */}
          <div className="space-y-2">

            {myPlayList.map((song, index) => {
              const isActive = activeSong === song.id;
              const isSaved = savedSongs.has(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => handlePlay(song.id)}
                  className={`flex items-center justify-between gap-3 px-3 sm:px-4 py-3 rounded-xl cursor-pointer transition border ${
                    isActive
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-white/5 border-transparent hover:bg-white/10"
                  }`}
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">

                    <span className="text-zinc-400 text-xs w-5 text-center">
                      {index + 1}
                    </span>

                    <img
                      src={song.thumbnail || "/custum thumbnail.webp"}
                      alt={song.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                    />

                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isActive ? "text-green-400" : "text-white"
                      }`}>
                        {song.title}
                      </p>

                      <p className="text-xs text-zinc-400 truncate max-w-[180px] sm:max-w-xs">
                        {song.description?.slice(0, 45) || "No description"}
                      </p>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div
                    className="flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >

                    {/* BOOKMARK */}
                    <button
                      onClick={() => handleBookmark(song.id)}
                      className={`transition ${
                        isSaved ? "text-green-500" : "text-zinc-400"
                      } hover:text-green-400`}
                    >
                      {isSaved ? (
                        <FaBookmark size={14} />
                      ) : (
                        <FaRegBookmark size={14} />
                      )}
                    </button>

                    {/* PLAY */}
                    <button
                      onClick={() => handlePlay(song.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 ${
                        isActive
                          ? "bg-green-500 text-black"
                          : "bg-white/10 text-white hover:bg-green-500 hover:text-black"
                      }`}
                    >
                      <FaPlay size={12} />
                    </button>

                  </div>
                </div>
              );
            })}

          </div>

          {/* EMPTY STATE */}
          {myPlayList.length === 0 && !loading && (
            <div className="text-center text-zinc-500 mt-12 text-sm">
              No songs in your playlist yet 🎧
            </div>
          )}

        </div>
      )}
    </Layout>
  );
};

export default PlayList;