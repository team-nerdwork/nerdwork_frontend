"use client";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Hero() {
  const slides = [
    {
      id: 1,
      src: "https://res.cloudinary.com/dk4gmufzn/image/upload/v1768479916/NERDWORKPLUSPAGE3_leayvj.png",
      alt: "hero image 1",
    },
    {
      id: 2,
      src: "https://res.cloudinary.com/dk4gmufzn/image/upload/v1768479884/NERDWORKPLUSPAGE2_hvmefj.png",
      alt: "hero image 2",
    },
    {
      id: 3,
      src: "https://res.cloudinary.com/dk4gmufzn/image/upload/v1768479888/NERDWORKPLUSPAGE4_nhxess.png",
      alt: "hero image 3",
    },
    {
      id: 4,
      src: "https://res.cloudinary.com/dk4gmufzn/image/upload/v1768479884/NERDWORKPLUSPAGE1_zdwfe3.png",
      alt: "hero image 4",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 5000; // 5 seconds per slide

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    setProgress(0);

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = (elapsed / SLIDE_DURATION) * 100;

      if (progressPercent >= 100) {
        nextSlide();
        return;
      }
      setProgress(progressPercent);
    }, 50);

    return () => clearInterval(timer);
  }, [currentSlide, isPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextSlide, prevSlide, isPlaying]);

  return (
    <header data-testid="event-hero">
      <div
        className="relative h-[95vh] w-full overflow-hidden"
        data-testid="hero-slideshow"
      >
        {/* Background Images */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                width={1600}
                height={1052}
                src={slide.src}
                alt={slide.alt}
                className="h-full w-full object-cover max-md:object-center"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 md:bg-[linear-gradient(270deg,rgba(13,13,13,0)_0%,#0D0D0D_73%)] max-md:bg-[linear-gradient(180deg,rgba(13,13,13,0)_0%,#0D0D0D_73%)]" />
            </div>
          ))}
        </div>
        {/* Content Overlay */}
        <>
          <div className="relative z-10 flex h-full font-montserrat max-w-[1440px] mx-auto  px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto flex flex-col md:justify-center max-md:justify-end text-white">
              <div className="max-w-xl flex flex-col gap-4 max-md:items-start">
                <p className="text-white max-md:text-[13px] flex font-bold items-center gap-1">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#1FF448] p-[2px] border border-[#1FF448s]" />
                  We&apos;re live!
                </p>
                <h1 className="md:text-[52px] max-md:text-[32px] font-firespace tracking-tight text-white animate-fade-in leading-tight">
                  African Stories Redefined
                </h1>
                <p className="max-w-[451px] max-md:text-sm">
                  Discover comics rooted in Africa ‘s past, present, and
                  future---all created by African storytellers
                </p>
                <Button
                  asChild
                  variant={"primary"}
                  className="w-full max-w-[222px] font-bold bg-[#009BCB] rounded-[12px] font-montserrat"
                >
                  <Link href={"/signin"}>Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        </>
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-20 max-md:bottom-1/3 right-4 z-20 rounded-full bg[#0d0d0d] border border-nerd-muted p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 sm:bottom-8"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>
        {/* Progress Bars */}
        <div className="absolute bottom-8 max-md:bottom-1/3 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative h-1 max-md:w-8 md:w-16 overflow-hidden rounded-full bg-white transition-all hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={`Go to slide ${index + 1}`}
            >
              {/* Background bar */}
              <div className="absolute inset-0 bg-white/30" />
              {/* Progress bar */}
              <div
                className={`absolute left-0 top-0 h-full bg-[#009BCB] transition-all duration-75 ease-linear ${
                  index === currentSlide ? "opacity-100" : "opacity-60"
                }`}
                style={{
                  width:
                    index === currentSlide
                      ? `${progress}%`
                      : index < currentSlide
                        ? "100%"
                        : "0%",
                }}
              />
              {/* Hover effect */}
              <div className="absolute inset-0 scale-0 bg-white/20 transition-transform group-hover:scale-100" />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
