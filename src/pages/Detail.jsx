import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader2, Book, VolumeX, Volume2, Play, Pause, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

export default function Detail() {
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [surah, setSurah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const fetchSurah = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${id}/ar.alafasy`);
      setSurah(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getFavorite = () => {
    const data = localStorage.getItem('favorites');
    if (data) {
      setFavorites(JSON.parse(data));
    }
  }

  const playNextAyah = useCallback(() => {
    if (currentAyahIndex === null) {
      setCurrentAyahIndex(0);
      return;
    }

    const nextIndex = currentAyahIndex + 1;
    if (nextIndex < surah.ayahs?.length) {
      setCurrentAyahIndex(nextIndex);
    } else {
      setAutoPlay(false);
      setCurrentAyahIndex(null);
      setIsPlaying(false);
    }
  }, [currentAyahIndex, surah.ayahs?.length]);

  const handleAudioEnded = useCallback(() => {
    if (autoPlay) {
      playNextAyah();
    } else {
      setIsPlaying(false);
      setCurrentAyahIndex(null);
    }
  }, [autoPlay, playNextAyah]);

  const playAudio = (audioUrl, index) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.removeEventListener('ended', handleAudioEnded);
    }

    const audio = new Audio(audioUrl);
    audio.addEventListener('ended', handleAudioEnded);
    
    setCurrentAudio(audio);
    setCurrentAyahIndex(index);
    setIsPlaying(true);
    audio.play();
  };

  const toggleAutoPlay = () => {
    if (!autoPlay) {
      setAutoPlay(true);
      if (!isPlaying) {
        setCurrentAyahIndex(0);
      }
    } else {
      setAutoPlay(false);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.removeEventListener('ended', handleAudioEnded);
    }
    setCurrentAudio(null);
    setIsPlaying(false);
    setCurrentAyahIndex(null);
    setAutoPlay(false);
  };

  useEffect(() => {
    fetchSurah();
    getFavorite();
    localStorage.setItem('lastRead', id);
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [id]);

  useEffect(() => {
    if (autoPlay && currentAyahIndex !== null && surah.ayahs?.[currentAyahIndex]) {
      playAudio(surah.ayahs[currentAyahIndex].audio, currentAyahIndex);
    }
  }, [currentAyahIndex, autoPlay]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const addFavorite = (ayah) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.number === ayah.number)) {
      favorites.push(ayah);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      Swal.fire({
        icon: 'success',
        title: 'Added to Favorites',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        getFavorite();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 mb-20">
      {/* Surah Header */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">{surah.englishName}</h1>
            <p className="text-lg text-gray-600">{surah.englishNameTranslation}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl md:text-3xl font-bold text-emerald-600">{surah.name}</h2>
            <p className="text-gray-600">{surah.numberOfAyahs} Ayat</p>
          </div>
        </div>
        
        {/* Auto-play control */}
        <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <button
            onClick={toggleAutoPlay}
            className={`flex text-xs items-center rounded-lg px-4 py-2 text-white transition ${
              autoPlay ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            {autoPlay ? (
              <><Pause className=" h-5 w-5" /></>
            ) : (   
              <><Play className=" h-5 w-5" /></>
            )}
          </button>
          
          {isPlaying && (
            <button
              onClick={stopAudio}
              className="flex text-xs items-center rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            >
              <VolumeX className="h-5 w-5" /> 
            </button>
          )}
        </div>
        <div className="flex gap-1">
          <Link to={"/surah"} className="flex text-xs items-center rounded-lg bg-emerald-500 px-4 py-2 text-white transition hover:bg-emerald-600">
          <Book className="h-5 w-5" />
          </Link>
          {
            favorites.some(fav => fav.number == surah.number) ? null : (
              <button onClick={() => addFavorite(surah)} className="flex text-xs items-center rounded-lg bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600">
                <Heart className="h-5 w-5" />
              </button>
            )
          }
        </div>
        </div>
      </div>

      {/* Verses */}
      <div className="space-y-4">
        {
          surah.englishName != "Al-Faatiha" && <div className="rounded-lg p-8 shadow-lg transition duration-300 hover:shadow-xl bg-gradient-to-br from-white to-gray-50">
          <div className="text-center">
            <p className="mb-4 text-xl md:text-3xl font-arabic leading-relaxed tracking-wide text-gray-800">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-sm font-medium text-gray-600">
              Bismillāhi r-raḥmāni r-raḥīm
            </p>
          </div>
        </div>
        }
      
        {surah.ayahs?.map((ayah, index) => (
          <div
            key={ayah.number}
            className={`rounded-lg p-6 shadow-lg transition hover:shadow-xl ${
              currentAyahIndex === index ? 'bg-emerald-50' : 'bg-white'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                {index + 1}
              </div>
              <button
                onClick={() => {
                  if (currentAyahIndex === index && isPlaying) {
                    stopAudio();
                  } else {
                    playAudio(ayah.audio, index);
                  }
                }}
                className={`flex items-center rounded-full p-2 transition ${
                  currentAyahIndex === index && isPlaying
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                }`}
              >
                {currentAyahIndex === index && isPlaying ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <div className="mb-4 text-right">
              <p className="mb-2 text-2xl font-arabic leading-loose text-gray-800">
                {index === 0  && surah.englishName != "Al-Faatiha" ? ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '') : ayah.text}
              </p>
            </div>
            
            <div>
              <p className="text-md leading-relaxed text-gray-600">
                {ayah.translation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}