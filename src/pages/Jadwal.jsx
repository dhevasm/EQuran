import React, { useState, useEffect } from 'react';
import { Loader2, Clock } from 'lucide-react';

export default function Jadwal() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          try {
            const date = new Date();
            const response = await fetch(
              `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=2`
            );
            const data = await response.json();
            setPrayerTimes(data.data.timings);
          } catch (err) {
            setError('Gagal mengambil jadwal sholat');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError('Mohon izinkan akses lokasi');
          setLoading(false);
        }
      );
    } else {
      setError('Browser tidak mendukung geolokasi');
      setLoading(false);
    }
  }, []);

  // Update countdown every second
  useEffect(() => {
    if (!prayerTimes) return;

    const interval = setInterval(() => {
      const prayers = {
        Subuh: prayerTimes.Fajr,
        Dzuhur: prayerTimes.Dhuhr,
        Ashar: prayerTimes.Asr,
        Maghrib: prayerTimes.Maghrib,
        Isya: prayerTimes.Isha
      };

      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Find next prayer
      let nextPrayerName = null;
      let nextPrayerTime = null;
      let smallestDiff = Infinity;

      Object.entries(prayers).forEach(([name, time]) => {
        const prayerDate = new Date();
        const [hours, minutes] = time.split(':');
        prayerDate.setHours(parseInt(hours), parseInt(minutes), 0);

        let diff = prayerDate - now;
        if (diff < 0) {
          // If prayer time has passed, add 24 hours
          diff += 24 * 60 * 60 * 1000;
        }

        if (diff < smallestDiff) {
          smallestDiff = diff;
          nextPrayerName = name;
          nextPrayerTime = time;
        }
      });

      // Calculate remaining time
      if (nextPrayerName) {
        const [hours, minutes] = nextPrayerTime.split(':');
        const prayerDate = new Date();
        prayerDate.setHours(parseInt(hours), parseInt(minutes), 0);
        
        let diff = prayerDate - now;
        if (diff < 0) {
          diff += 24 * 60 * 60 * 1000;
        }

        const remainingHours = Math.floor(diff / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const remainingSeconds = Math.floor((diff % (1000 * 60)) / 1000);

        setNextPrayer({ name: nextPrayerName, time: nextPrayerTime });
        setCountdown(`${String(remainingHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const formatTime = (timeStr) => {
    return new Date(`2024-01-01T${timeStr}`).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className='relative h-screen w-screen flex flex-col justify-start items-center bg-gradient-to-br from-[#399349] to-[#47B85C]'>
      <img src="/img/cover.jpeg" className='absolute inset-0 w-full h-full object-cover opacity-50' alt="" />
      <div className='z-20 mt-3 text-white p-6 bg-black/30 rounded-lg backdrop-blur-sm w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-6'>Jadwal Sholat</h1>
        
        {loading ? (
          <div className='flex justify-center items-center p-8'>
            <Loader2 className='animate-spin' size={40} />
          </div>
        ) : error ? (
          <div className='text-center p-4 bg-red-500/50 rounded'>
            {error}
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='text-center mb-4'>
              <p className='text-lg'>{new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              {location && (
                <p className='text-sm opacity-75'>
                  {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                </p>
              )}
            </div>

            {nextPrayer && (
              <div className='bg-white/20 p-4 rounded-lg text-center mb-6'>
                <div className='flex items-center justify-center gap-2 text-lg mb-2'>
                  <Clock className='animate-pulse' />
                  <span>Menuju Waktu {nextPrayer.name}</span>
                </div>
                <div className='text-3xl font-bold font-mono'>{countdown}</div>
              </div>
            )}
            
            <div className='grid grid-cols-2 gap-4'>
              <div className={`bg-white/10 p-4 rounded ${nextPrayer?.name === 'Subuh' ? 'ring-2 ring-white' : ''}`}>
                <h3 className='text-lg font-medium'>Subuh</h3>
                <p className='text-2xl font-bold'>{formatTime(prayerTimes?.Fajr)}</p>
              </div>
              <div className={`bg-white/10 p-4 rounded ${nextPrayer?.name === 'Dzuhur' ? 'ring-2 ring-white' : ''}`}>
                <h3 className='text-lg font-medium'>Dzuhur</h3>
                <p className='text-2xl font-bold'>{formatTime(prayerTimes?.Dhuhr)}</p>
              </div>
              <div className={`bg-white/10 p-4 rounded ${nextPrayer?.name === 'Ashar' ? 'ring-2 ring-white' : ''}`}>
                <h3 className='text-lg font-medium'>Ashar</h3>
                <p className='text-2xl font-bold'>{formatTime(prayerTimes?.Asr)}</p>
              </div>
              <div className={`bg-white/10 p-4 rounded ${nextPrayer?.name === 'Maghrib' ? 'ring-2 ring-white' : ''}`}>
                <h3 className='text-lg font-medium'>Maghrib</h3>
                <p className='text-2xl font-bold'>{formatTime(prayerTimes?.Maghrib)}</p>
              </div>
              <div className={`bg-white/10 p-4 rounded col-span-2 ${nextPrayer?.name === 'Isya' ? 'ring-2 ring-white' : ''}`}>
                <h3 className='text-lg font-medium'>Isya</h3>
                <p className='text-2xl font-bold'>{formatTime(prayerTimes?.Isha)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}