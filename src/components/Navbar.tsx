import { useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";


const Navbar = () => {
  const navigate = useNavigate();
  const {isAuth, logoutUser} = useUserData();

  const logoutUserHanlder = ()=>{
    logoutUser();
  }

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2 font-['Satoshi'] ">
          <img
            src="/left_arrow.webp"
            alt=""
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <img
            src="/right_arrow.webp"
            alt=""
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            onClick={() => navigate(1)}
          />
        </div>
        <div className="flex items-center gap-4">
          <p className="px-4 py-1.5 bg-white text-black text-sm rounded-full hidden md:block cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]">
            Explore Premium
          </p>
          <p className="px-4 py-1.5 bg-white text-black text-sm rounded-full hidden md:block cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]">
            Install App
          </p>
          {isAuth ? (<p onClick={logoutUserHanlder} className="px-4 py-1.5 bg-white text-black text-sm rounded-full cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] ">
            Logout
          </p>) : ( <p onClick={()=>navigate("/login")} className="px-4 py-1.5 bg-white text-black text-sm rounded-full cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] ">
            Login
          </p>)}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-5">
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer" onClick={()=>navigate("/")}>All</p>
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hidden md:block">Music</p>
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hidden md:block">Podcast</p>
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer md:hidden" onClick={()=>navigate("/playlist")}>Playlist</p>
      </div>
    </>
  );
};

export default Navbar;
