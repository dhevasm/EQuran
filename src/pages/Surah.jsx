import React from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Surah() {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [surah, setSurah] = React.useState([]);
  const [surahFiltered, setSurahFiltered] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchSurah = async () => {
    try {
      setLoading(true);
      axios.get(API_URL).then((response) => {
        setSurah(response.data.data);
        setSurahFiltered(response.data.data);
        setLoading(false);
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSurah();
  }, []);

  const ToDetail = (id) => {
    navigate(`/surah/${id}`);
  };

  return (
    <>
      <div className="z-1 fixed h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-gradient-to-br from-[#399349] to-[#47B85C]">
        <img
          src="/img/cover.jpeg"
          className="fixed z-2 inset-0 w-full h-full object-cover opacity-50"
          alt=""
        />
        <div className="absolute top-0 left-0 m-4 z-30 text-white text-2xl font-bold">
          E<span className="text-[#FFB30F] font-bold">Quran</span> Surah
        </div>
        
        <div className="h-[100vh] w-[100vw] overflow-auto z-10 pb-40">
          <div className="flex justify-center self-start my-10  mt-16">
            <div className="relative mx-3 w-full md:w-1/3">
              <input
                type="text"
                placeholder="Cari Surah..."
                className="p-2 rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  setSurahFiltered(
                    surah.filter(
                      (item) =>
                        item.englishName.toLowerCase().includes(searchTerm) ||
                        item.name.toLowerCase().includes(searchTerm)
                    )
                  );
                }}
              />
              <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-7">
            {surahFiltered.length > 0 ? (
              surahFiltered.map((item, index) => (
                <div
                  key={index}
                  onClick={() => ToDetail(item.number)}
                  className="z-10 bg-white p-4 w-full mx-3 md:w-1/5 rounded-lg shadow-md cursor-pointer  hover:transform hover:scale-105 transition-transform duration-300"
                >
                  <h1 className="text-lg font-semibold">
                    {item.number}. {item.englishName} ({item.numberOfAyahs})
                  </h1>
                  <p className="md:text-xs">
                    {item.name} | {item.englishNameTranslation}
                  </p>
                </div>
              ))
            ) : loading ? (
              <p className="text-white animate-pulse">Loading...</p>
            ) : (
              <p className="text-white">Data tidak ditemukan</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
