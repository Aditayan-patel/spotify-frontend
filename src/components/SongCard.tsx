import React from "react";
import { FaPlay } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
  const { addToPlayList, isAuth } = useUserData();
  const { setSelectedSong, setIsPlaying } = useSongData();

  const saveToPlayListHandler = () => {
    addToPlayList(id);
  };

  return (
    // Outer div = gradient border
    <div className="min-w-45 p-[1.5px]  m-1 rounded-2xl bg-gradient-to-b from-green-900 via-green-900 to-green-400">
      {/* Inner div = actual card */}
      <div className="p-2 px-3 rounded-[calc(1rem-1.5px)] cursor-pointer bg-[#171616] hover:bg-[#333131] transition-all duration-300 hover:shadow-[0_0_5px_rgba(255,255,255,0.25)]">
        <div className="relative group">
          <img src={image} alt={name} className="mr-1 w-40 h-40 rounded-md" />

          <div className="flex gap-2 cursor-pointer">
            <button className="absolute bottom-1 left-2 bg-green-600 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:shadow-[0_0_5px_rgba(34,197,94,0.6)] cursor-pointer" onClick={()=>{
              setSelectedSong(id);
              setIsPlaying(true);
            }}>
              <FaPlay className="transition-transform duration-300 ease-in-out hover:scale-110" />
            </button>

            {isAuth && (
              <button
                className="absolute bottom-1 right-2 bg-green-600 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:shadow-[0_0_5px_rgba(34,197,94,0.6)] cursor-pointer"
                onClick={saveToPlayListHandler}
              >
                <FaBookmark className="transition-transform duration-300 ease-in-out hover:scale-110" />
              </button>
            )}
          </div>
        </div>

        <p className="font-bold mt-2 mb-1">{name.length > 15 ? `${name.slice(0, 10)}...` : name}</p>

        <p className="text-slate-200 text-sm">
          {desc.length > 20 ? `${desc.slice(0, 20)}...` : desc}
        </p>
      </div>
    </div>
  );
};

export default SongCard;
