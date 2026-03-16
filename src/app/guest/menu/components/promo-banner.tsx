import { BANNERS } from '@/constants/category';
import React, { useCallback, useEffect, useRef, useState } from 'react'


const PromoBanner = () => {
    const touchStartX = useRef(0);
    const [bannerIndex, setBannerIndex] = useState(0);

    const goTo = useCallback((idx: number) => {
        setBannerIndex((idx + BANNERS.length) % BANNERS.length);
    }, []);
    useEffect(() => {
        const timer = setInterval(() => goTo(bannerIndex + 1), 3500);
        return () => clearInterval(timer);
    }, [bannerIndex, goTo]);

    return (
        <div className="px-4 mt-1 mb-1">
            <div
                className="overflow-hidden rounded-2xl"
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                    const dx = e.changedTouches[0].clientX - touchStartX.current;
                    if (dx < -40) goTo(bannerIndex + 1);
                    if (dx > 40) goTo(bannerIndex - 1);
                }}
            >
                <div
                    className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                    style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
                >
                    {BANNERS.map((banner, i) => (
                        <div key={i} className="relative w-full shrink-0 h-37">
                            {/* Dùng <img> thường cho banner vì ảnh ngoài domain, tránh config next/image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={banner.image}
                                alt={banner.sub}
                                className="w-full h-full object-cover brightness-75"
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-transparent flex flex-col justify-center px-5 gap-1">
                                <p className="text-white/70 text-[11px] tracking-wide">{banner.sub}</p>
                                <p className={`text-[22px] font-extrabold leading-tight whitespace-pre-line ${banner.titleColor}`}>
                                    {banner.title}
                                </p>
                                <div className="mt-1 inline-flex items-center bg-white text-[#111] text-[11px] font-bold px-4 py-1.5 rounded-full w-fit">
                                    {banner.btn} →
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center items-center gap-1.25 mt-3">
                {BANNERS.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => goTo(i)}
                        style={{ width: i === bannerIndex ? 14 : 5, height: 5, borderRadius: 999, background: i === bannerIndex ? '#f0c040' : '#3a3428', transition: 'all 0.3s', cursor: 'pointer', flexShrink: 0 }}
                    />
                ))}
            </div>
        </div>
    )
}

export default PromoBanner