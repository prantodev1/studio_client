"use client";

import { useState, useEffect } from "react";

const slides = [
  {
    title: "Find Your Perfect Creative Space",
    description:
      "Discover professional studios for photography, filmmaking, podcasts and more.",
    button: "Explore Studios",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    link: "/studios",
  },
  {
    title: "Create Something Amazing",
    description:
      "Find inspiring spaces and bring your creative ideas to life with StudioSpace.",
    button: "Discover Spaces",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    link: "/studios",
  },
  {
    title: "Share Your Studio With Creators",
    description:
      "List your workspace and connect with creative professionals around you.",
    button: "Become a Host",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c",
    link: "/add-studio",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = slides[currentSlide];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  return (
    <section className="px-4 pt-5 sm:px-6 lg:px-8">
      <div
        className="group relative mx-auto flex min-h-[400px] max-w-7xl items-center overflow-hidden rounded-2xl bg-cover bg-center shadow-xl transition-all duration-700 sm:min-h-[450px] lg:min-h-[480px]"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(8,15,30,0.88) 0%, rgba(8,15,30,0.65) 50%, rgba(8,15,30,0.15) 100%), url("${slide.image}?auto=format&fit=crop&w=1800&q=85")`,
        }}
      >
        {/* Hero Content */}
        <div
          key={currentSlide}
          className="relative z-10 w-full max-w-3xl px-7 py-16 text-white sm:px-12 lg:px-16"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-md sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-blue-400"></span>
            WELCOME TO STUDIOSPACE
          </span>

          <h1 className="mb-5 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {slide.title}
          </h1>

          <p className="mb-8 max-w-xl text-sm leading-7 text-gray-200 sm:text-base sm:leading-8">
            {slide.description}
          </p>

          <a
            href={slide.link}
            className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
          >
            {slide.button}
            <span className="text-lg">→</span>
          </a>
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-white opacity-0 backdrop-blur-md transition hover:bg-white/20 group-hover:opacity-100 focus:opacity-100 sm:left-5"
        >
          ❮
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-white opacity-0 backdrop-blur-md transition hover:bg-white/20 group-hover:opacity-100 focus:opacity-100 sm:right-5"
        >
          ❯
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-7 z-20 flex items-center gap-2 sm:left-12 lg:left-16">
          {slides.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}

          <span className="ml-3 text-xs font-medium text-white/70">
            0{currentSlide + 1} / 0{slides.length}
          </span>
        </div>

        {/* Bottom Gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    </section>
  );
}