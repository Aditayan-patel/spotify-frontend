import React from "react";
import { useNavigate } from "react-router-dom";

interface AlbumCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  return (
    <div className="min-w-45 p-[1.5px] m-1 rounded-2xl bg-gradient-to-b from-green-900 via-green-800 to-green-400">
      <div
        onClick={() => navigate("/album/" + id)}
        className="group p-2 px-3 rounded-[calc(1rem-1.5px)] cursor-pointer bg-[#1e1c1c] hover:bg-[#333131] transition-all duration-300 hover:shadow-[0_0_5px_rgba(255,255,255,0.25)]"
      >
        {/* Image Wrapper */}
        <div className="overflow-hidden rounded-md">
          
          <img
            src={image}
            alt={name}
            className="w-40 rounded-md transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>

        <p className="font-bold mt-2 mb-1 text-white">
          {name.length > 12 ? `${name.slice(0, 12)}...` : name}
        </p>

        <p className="text-slate-400 text-sm">
          {desc.length > 18 ? `${desc.slice(0, 18)}...` : desc}
        </p>
      </div>
    </div>
  );
};

export default AlbumCard;
