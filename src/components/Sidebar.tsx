import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { useUserData } from "../context/UserContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  return (
    <div className="w-1/4 h-full p-2 flex-col gap-2 text-white hidden lg:flex ">
      <div className="bg-[#1F1F1F] h-[15%] rounded-2xl flex flex-col justify-around ">
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/home.webp" alt="home" className="w-6" />
          <p className="font-bold mt-2">Home</p>
        </div>
        <div className="flex items-center gap-3 pl-8 cursor-pointer">
          <img src="/search.webp" alt="home" className="w-6" />
          <p className="font-bold mt-1 ">Search</p>
        </div>
      </div>
      <div className="h-[85%] bg-[#1F1f1f] rounded-2xl">
        <div className="p-8 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/stack.webp" alt="" className="w-8" />
            <p className="font-semibold"> Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img src="/arrow.webp" alt="" className="w-5 cursor-pointer" />
            <img src="/plus.webp" alt="" className="w-5 cursor-pointer" />
          </div>
        </div>
        <div onClick={() => navigate("/playlist")} className="px-4">
          <PlayListCard />
        </div>
        <div className="p-4 m-2 bg-[#1f1f1f] font-semibold rounded flex flex-col items-start gap-1 pl-4 mt-5">
          <h1 className="text-sm">Let's findsome podcasts to follow</h1>
          <p className="font-light text-xs">
            we'll keep you update on new episods
          </p>
          <button className="px-4 py-1.5 bg-white font-light text-black text-sm rounded-full mt-5 cursor-pointer">
            Browse Podcast
          </button>
        </div>
       {user && user.role === "admin" && <button
          className="px-5 py-1.5 bg-white text-black text-sm rounded-full mt-5 ml-6 cursor-pointer
             "
          onClick={() => navigate("/admin/dashboard")}
        >
          Admin Dashboard
        </button>}
      </div>
    </div>
  );
};

export default Sidebar;
