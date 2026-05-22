import { FaMusic } from "react-icons/fa";
import { useUserData } from "../context/UserContext";

const PlayListCard = () => {
  const {user, isAuth} = useUserData();
  return (
    <div className="flex items-center p-4 rounded-2xl cursor-pointer bg-transparent  transition ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.25)] hover:bg-[#ffffff07]">
     <div className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded-md">
        <FaMusic className="text-white text-xl" />
     </div>
     <div className="ml-4 ">
        <h2>My Playlist</h2>
        <p className="text-gray-400 text-sm">
            PlayList   • {isAuth? <span className="animate-pulse text-green-400 text-md font-bold">{user?.name}</span>  :<span className="animate-pulse text-green-600 text-md font-bold">{"User"}</span>}
        </p>
     </div>
    </div>
  );
};

export default PlayListCard;