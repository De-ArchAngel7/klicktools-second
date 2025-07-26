"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin);
}

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [showText, setShowText] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run animations on client side
    if (!isClient) return;

    // Check if all refs are available
    if (
      !containerRef.current ||
      !titleRef.current ||
      !subtitleRef.current ||
      !backgroundRef.current
    ) {
      return;
    }

    // GSAP Timeline for amazing animations
    const tl = gsap.timeline();

    // Initial setup
    gsap.set(containerRef.current, { opacity: 0 });
    gsap.set(titleRef.current, { opacity: 0, y: 100 });
    gsap.set(subtitleRef.current, { opacity: 0, scale: 0.5 });
    gsap.set(backgroundRef.current, { scale: 1.2, rotation: 5 });

    // Main animation sequence
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    })
      .to(
        backgroundRef.current,
        {
          scale: 1,
          rotation: 0,
          duration: 2,
          ease: "power2.out",
        },
        0
      )
      .to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "back.out(1.7)",
        },
        0.5
      )
      .to(
        titleRef.current,
        {
          text: "KlickTools",
          duration: 2,
          ease: "power2.out",
          onComplete: () => setShowText(true),
        },
        1
      )
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
        },
        2.5
      )
      .to(
        subtitleRef.current,
        {
          text: "Welcome to KlickTools — Find the smartest tools on the web",
          duration: 3,
          ease: "power2.out",
        },
        3
      );

    // Particle animations
    particlesRef.current.forEach((particle, index) => {
      if (particle) {
        gsap.set(particle, {
          opacity: 0,
          scale: 0,
          rotation: Math.random() * 360,
        });

        gsap.to(particle, {
          opacity: 1,
          scale: 1,
          rotation: `+=${Math.random() * 720 - 360}`,
          duration: 1.5,
          ease: "back.out(1.7)",
          delay: 2 + index * 0.1,
        });
      }
    });

    // Floating animation for particles
    particlesRef.current.forEach((particle, index) => {
      if (particle) {
        gsap.to(particle, {
          y: `-=${Math.random() * 100 + 50}`,
          x: `+=${Math.random() * 200 - 100}`,
          rotation: `+=${Math.random() * 360}`,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: 4 + index * 0.2,
        });
      }
    });

    // Glowing orb animations
    const orbs = document.querySelectorAll(".glow-orb");
    orbs.forEach((orb, index) => {
      gsap.set(orb, { scale: 0, opacity: 0 });

      gsap.to(orb, {
        scale: 1,
        opacity: 0.6,
        duration: 2,
        ease: "back.out(1.7)",
        delay: 1 + index * 0.3,
      });

      gsap.to(orb, {
        scale: 1.2,
        opacity: 0.3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 3 + index * 0.5,
      });
    });

    // Matrix rain effect
    const matrixContainer = document.querySelector(".matrix-rain");
    if (matrixContainer) {
      gsap.set(matrixContainer, { opacity: 0 });
      gsap.to(matrixContainer, {
        opacity: 0.3,
        duration: 2,
        delay: 1,
      });
    }

    // Audio effect (if available)
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Ignore audio errors
      });
    }

    return () => {
      tl.kill();
    };
  }, [isClient]);

  const handleClick = () => {
    // Exit animation
    const tl = gsap.timeline({
      onComplete: onComplete,
    });

    tl.to(containerRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: "power2.in",
    })
      .to(
        titleRef.current,
        {
          y: -100,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
        },
        0
      )
      .to(
        subtitleRef.current,
        {
          scale: 0.5,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
        },
        0.1
      )
      .to(
        particlesRef.current,
        {
          opacity: 0,
          scale: 0,
          duration: 0.4,
          stagger: 0.02,
          ease: "power2.in",
        },
        0.2
      );
  };

  return (
    <>
      {!isClient ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-white">Loading...</div>
        </div>
      ) : (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClick}
        >
          {/* AI City Skyline Background Image */}
          <div ref={backgroundRef} className="absolute inset-0 onboarding-bg">
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Matrix Rain Effect */}
          <div className="matrix-rain absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className={`matrix-char animation-delay-${Math.floor(
                  Math.random() * 6
                )}`}
              >
                {String.fromCharCode(0x30a0 + Math.random() * 96)}
              </div>
            ))}
          </div>

          {/* Animated Sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) particlesRef.current[i] = el;
                }}
                className={`particle w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full particle-${
                  i + 1
                }`}
              />
            ))}
          </div>

          {/* Glowing Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`glow-orb w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-xl glow-orb-${
                  i + 1
                }`}
              />
            ))}
          </div>

          {/* Audio Element */}
          <audio ref={audioRef} preload="auto">
            <source src="/sounds/intro.mp3" type="audio/mpeg" />
          </audio>

          {/* Content */}
          <div className="relative z-10 text-center px-6">
            <motion.div className="mb-8 relative">
              <h1
                ref={titleRef}
                className="text-6xl md:text-8xl font-bold gradient-text text-shadow mb-4 relative z-10"
              >
                KlickTools
              </h1>
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 blur-3xl -z-10 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-2xl -z-20 animate-pulse animation-delay-5" />
            </motion.div>

            <AnimatePresence>
              {showText && (
                <motion.div ref={subtitleRef} className="mb-8">
                  <div className="typing-animation text-2xl md:text-3xl font-medium text-white max-w-4xl mx-auto">
                    Welcome to KlickTools — Find the smartest tools on the web
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6, duration: 1 }}
              className="text-lg text-cyan-300/90 font-medium"
            >
              Click anywhere to continue
            </motion.div>

            {/* Enhanced loading indicator with cyan theme */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5, duration: 1 }}
            >
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-cyan-400 rounded-full cyan-loading-dot"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}
