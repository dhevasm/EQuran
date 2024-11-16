import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { FaHome, FaSearch, FaBookmark, FaHeart, FaClock, FaHistory } from "react-icons/fa";

export default function Navigation() {
  const Navigate = useNavigate();

  const startQuran = () => {
    if(localStorage.getItem('lastRead') !== null){
        Navigate(`/surah/${localStorage.getItem('lastRead')}`);
    }else{
        Navigate('/surah');
    }
}

  return (
    <nav className="fixed z-20 w-screen bottom-0 shadow-lg">
      <ul className="flex justify-around bg-[#FFB30F] text-white py-1">
        <Link to="/" className="flex flex-col items-center mt-2">
          <FaHome size={20}  />
          <p className="text-sm">Home</p>
        </Link>
        <button onClick={startQuran} className="flex flex-col items-center mt-2">
          <FaHistory size={20} />
          <p className="text-sm">Riwayat</p>
        </button>
        <Link to={"/surah"} className="relative flex flex-col items-center -mt-4">
          <div className="bg-white text-[#FFB30F] p-3 rounded-full">
            <FaBookmark size={20} />
          </div>
          <p className="text-sm mt-1">Surah</p>
        </Link>
        <Link to={"/favorite"} className="flex flex-col items-center mt-2">
          <FaHeart size={20} />
          <p className="text-sm">Favorit</p>
        </Link>
        <Link to={"/jadwal"} className="flex flex-col items-center mt-2">
          <FaClock size={20} />
          <p className="text-sm">Jadwal</p>
        </Link>
      </ul>
    </nav>
  );
}
