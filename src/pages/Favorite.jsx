import React from 'react'
import { useState, useEffect } from 'react'
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaHeart } from 'react-icons/fa';
import { FaBackspace } from 'react-icons/fa';

export default function Favorite() {
    const [favorites, setFavorites] = useState([])
    const [favoritesFiltered, setFavoritesFiltered] = useState([])

    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(true);

    const getFavorite = () => {
        const data = localStorage.getItem('favorites')
        if(data){
            setFavorites(JSON.parse(data))
            setFavoritesFiltered(JSON.parse(data))
        }
        setLoading(false)

    }

    useEffect(() => {
        getFavorite()
    }, [])

    useEffect(() => {
        console.log(favorites)
    }, [favorites])


    const handleRemove = (index) => {
        const newFavorites = favorites.filter((_, i) => i !== index);
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        getFavorite();
    };

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
        Surah <span className="text-[#FFB30F] font-bold">Favorit</span> 
        </div>
        <div className="h-[100vh] w-[100vw] overflow-auto z-10 pb-40">
          <div className="flex justify-center self-start my-10 mt-16">
            <div className="relative mx-3 w-full md:w-1/3">
              <input
                type="text"
                placeholder="Cari Surah..."
                className="p-2 rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  setFavoritesFiltered(
                    favorites.filter(
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
            {favoritesFiltered.length > 0 ? (
              favoritesFiltered.map((item, index) => (
                <div
                  key={index}
                  onClick={() => ToDetail(item.number)}
                  className="z-10 bg-white p-4 w-full mx-3 md:w-1/5 rounded-lg shadow-md cursor-pointer  hover:transform hover:scale-105 transition-transform duration-300"
                >
                  <h1 className="text-lg font-semibold">
                    {item.number}. {item.englishName} ({item.numberOfAyahs})
                  </h1>
                  <div className='flex justify-between'>
                  <p className="md:text-xs">
                    {item.name} | {item.englishNameTranslation}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    <FaBackspace />
                  </button>
                  </div>
                </div>
              ))
            ) : loading ? (
              <p className="text-white animate-pulse">Loading...</p>
            ) : (
              <p className='text-white'>Kamu tidak memiliki daftar favorit</p>
            )}
          </div>
        </div>
      </div>
    </>

  )
}
