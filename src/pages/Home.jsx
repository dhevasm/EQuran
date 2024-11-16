import React, { useEffect, useRef, useState } from 'react';
import { FaGithub, FaBookOpen, FaMapMarkerAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Quotes from '../json/Quotes.json';

export default function Home() {
    const Navigate = useNavigate();
    const Clock = useRef(null);
    const QuotesRef = useRef(null);
    const [nextPrayer, setNextPrayer] = useState({ name: '', countdown: '' });
    const [prayerTimes, setPrayerTimes] = useState(null);

    useEffect(() => {
        // Set random quote
        const randomQuote = Quotes.quotes[Math.floor(Math.random() * Quotes.quotes.length)];
        QuotesRef.current.innerText = randomQuote.text;

        // Get prayer times
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const date = new Date();
                        const response = await fetch(
                            `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=2`
                        );
                        const data = await response.json();
                        setPrayerTimes(data.data.timings);
                    } catch (err) {
                        console.error('Failed to fetch prayer times:', err);
                    }
                },
                (err) => {
                    console.error('Location access denied:', err);
                }
            );
        }
    }, []);

    useEffect(() => {
        const clockInterval = setInterval(() => {
            const date = new Date();
            if (Clock.current !== null) {
                Clock.current.innerText = date.toLocaleTimeString();
            }
        }, 1000);

        return () => clearInterval(clockInterval);
    }, []);

    // Update prayer countdown
    useEffect(() => {
        if (!prayerTimes) return;

        const countdownInterval = setInterval(() => {
            const prayers = {
                Subuh: prayerTimes.Fajr,
                Dzuhur: prayerTimes.Dhuhr,
                Ashar: prayerTimes.Asr,
                Maghrib: prayerTimes.Maghrib,
                Isya: prayerTimes.Isha
            };

            const now = new Date();
            let nextPrayerName = null;
            let nextPrayerTime = null;
            let smallestDiff = Infinity;

            Object.entries(prayers).forEach(([name, time]) => {
                const [hours, minutes] = time.split(':');
                const prayerDate = new Date();
                prayerDate.setHours(parseInt(hours), parseInt(minutes), 0);

                let diff = prayerDate - now;
                if (diff < 0) {
                    diff += 24 * 60 * 60 * 1000; // Add 24 hours if prayer time has passed
                }

                if (diff < smallestDiff) {
                    smallestDiff = diff;
                    nextPrayerName = name;
                    nextPrayerTime = time;
                }
            });

            if (nextPrayerName) {
                const hours = Math.floor(smallestDiff / (1000 * 60 * 60));
                const minutes = Math.floor((smallestDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((smallestDiff % (1000 * 60)) / 1000);

                setNextPrayer({
                    name: nextPrayerName,
                    countdown: `${hours} jam ${minutes} menit ${seconds} detik`
                });
            }
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [prayerTimes]);

    const startQuran = () => {
        if (localStorage.getItem('lastRead') !== null) {
            Navigate(`/surah/${localStorage.getItem('lastRead')}`);
        } else {
            Navigate('/surah');
        }
    }

    return (
        <>
            <div className='relative h-[100vh] w-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#399349] to-[#47B85C]'>
                <img src="/img/cover.jpeg" className='absolute inset-0 w-full h-full object-cover opacity-50' alt="" />
                <div className='relative z-10 text-white text-center flex flex-col items-center'>
                    <img src="/img/icon.png" alt="" width={200} />
                    <h1 className='text-5xl font-semibold text-[#FFB30F] text-center'>
                        <span className='font-bold text-white'>E</span>Quran
                    </h1>
                    <h2 ref={Clock} className='text-xl text-center'>00:00:00</h2>
                    <div className='flex flex-col items-center gap-1'>
                        <p className='text-lg font-medium'>Menuju waktu {nextPrayer.name}</p>
                        <p className='text-sm font-light'>{nextPrayer.countdown}</p>
                    </div>
                    <button 
                        onClick={startQuran} 
                        className='mt-4 flex gap-2 px-6 py-2 bg-[#FFB30F] text-white font-semibold rounded-lg shadow-md hover:bg-[#e6a00d] transition duration-300'
                    >
                        <FaBookOpen size={20} />
                        Baca Al-Quran
                    </button>
                    <p className='mt-5 max-w-72' ref={QuotesRef}></p>
                </div>
                <div className='absolute top-4 right-4'>
                    <a href="https://github.com/dhevasm" target="_blank" rel="noopener noreferrer">
                        <button className='px-4 py-2 flex gap-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-300'>
                            <FaGithub size={20} />
                        </button>
                    </a>
                </div>
                <div className='absolute top-4 left-4'>
                    <Link 
                        to="https://maps.app.goo.gl/Ry4qCevZqtY345N39" 
                        target='_blank' 
                        className='px-4 py-2 flex gap-2 text-xs md:text-sm max-w-60 md:max-w-full text-white font-semibold rounded-lg transition duration-300'
                    >
                        <FaMapMarkerAlt size={20} />
                        Masjid Nasional Al-Akbar Surabaya
                    </Link>
                </div>
            </div>
        </>
    );
}