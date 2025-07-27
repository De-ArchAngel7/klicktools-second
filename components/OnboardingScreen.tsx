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
  const [currentStep, setCurrentStep] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: "Klicktools",
      subtitle: "Your AI toolkit awaits",
      duration: 3000,
    },
  ];

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-progression effect
  useEffect(() => {
    if (!isClient) return;

    const timer = setTimeout(() => {
      // Complete onboarding after the single step
      setTimeout(() => {
        handleComplete();
      }, 1000);
    }, steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, isClient]);

  useEffect(() => {
    // Only run animations on client side
    if (!isClient) return;

    // Check if all refs are available
    if (
      !containerRef.current ||
      !titleRef.current ||
      !subtitleRef.current ||
      !backgroundRef.current ||
      !progressRef.current
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
    gsap.set(progressRef.current, { scaleX: 0 });

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
        progressRef.current,
        {
          scaleX: 1,
          duration: 2,
          ease: "power2.out",
        },
        0.5
      );

    // Enhanced particle animations
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
          delay: 1 + index * 0.05,
        });

        // Continuous floating animation
        gsap.to(particle, {
          y: `-=${Math.random() * 150 + 100}`,
          x: `+=${Math.random() * 300 - 150}`,
          rotation: `+=${Math.random() * 720 - 360}`,
          duration: 4 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: 2 + index * 0.1,
        });

        // Glow pulse animation
        gsap.to(particle, {
          boxShadow: "0 0 20px rgba(34, 211, 238, 0.8)",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: 3 + index * 0.2,
        });
      }
    });

    // Enhanced glowing orb animations
    const orbs = document.querySelectorAll(".glow-orb");
    orbs.forEach((orb, index) => {
      gsap.set(orb, { scale: 0, opacity: 0 });

      gsap.to(orb, {
        scale: 1,
        opacity: 0.4,
        duration: 2,
        ease: "back.out(1.7)",
        delay: 0.5 + index * 0.2,
      });

      gsap.to(orb, {
        scale: 1.3,
        opacity: 0.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 2 + index * 0.3,
      });

      // Orb movement
      gsap.to(orb, {
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        duration: 8 + Math.random() * 4,
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
        opacity: 0.2,
        duration: 2,
        delay: 0.5,
      });
    }

    return () => {
      tl.kill();
      return;
    };
  }, [currentStep, isClient]);

  // Step change animation
  useEffect(() => {
    if (!isClient || !titleRef.current || !subtitleRef.current) return;

    const tl = gsap.timeline();

    // Initial setup
    gsap.set(titleRef.current, { opacity: 0, y: 50 });
    gsap.set(subtitleRef.current, { opacity: 0, scale: 0.8 });

    // Main animation sequence
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "back.out(1.7)",
    })
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
        0.5
      )
      .to(
        titleRef.current,
        {
          textShadow:
            "0 0 30px rgba(34, 211, 238, 0.8), 0 0 60px rgba(34, 211, 238, 0.6), 0 0 90px rgba(34, 211, 238, 0.4)",
          duration: 2,
          ease: "power2.out",
        },
        1
      );

    // Enhanced glow effect for Klicktools
    gsap.to(titleRef.current, {
      textShadow:
        "0 0 40px rgba(34, 211, 238, 1), 0 0 80px rgba(34, 211, 238, 0.8), 0 0 120px rgba(34, 211, 238, 0.6)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: 3,
    });

    // Simple particle effects
    particlesRef.current.forEach((particle, index) => {
      if (particle) {
        gsap.to(particle, {
          scale: 1.2,
          boxShadow:
            "0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.6)",
          duration: 1.5,
          delay: index * 0.02,
        });
      }
    });

    return () => {
      tl.kill();
      return;
    };
  }, [currentStep, isClient]);

  const handleComplete = () => {
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
        >
          {/* AI City Skyline Background Image */}
          <div ref={backgroundRef} className="absolute inset-0 onboarding-bg">
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-purple-900/60 to-slate-900/60">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-cyan-500/5 to-purple-500/5 animate-pulse animation-delay-2" />
          </div>

          {/* Floating Geometric Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-30 floating-shape-${
                  i + 1
                }`}
              />
            ))}
          </div>

          {/* Enhanced Glowing Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) particlesRef.current[i] = el;
                }}
                className={`particle w-2 h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full particle-${
                  i + 1
                } shadow-lg shadow-cyan-400/70 filter blur-[0.5px]`}
              />
            ))}
          </div>

          {/* Enhanced Glowing Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`glow-orb w-40 h-40 bg-gradient-to-r from-cyan-400/20 via-purple-500/15 to-pink-500/20 rounded-full blur-3xl glow-orb-${
                  i + 1
                }`}
              />
            ))}
          </div>

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <motion.div className="mb-12 relative">
              <h1
                ref={titleRef}
                className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 relative z-10 leading-tight tracking-tight"
              >
                {steps[currentStep].title}
              </h1>
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 blur-2xl -z-10 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-xl -z-20 animate-pulse animation-delay-1" />
            </motion.div>

            <motion.div ref={subtitleRef} className="mb-8">
              <div className="typing-animation text-xl md:text-2xl font-medium text-white/90 max-w-3xl mx-auto leading-relaxed">
                {steps[currentStep].subtitle}
              </div>
            </motion.div>

            {/* Enhanced loading indicator */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full shadow-lg shadow-cyan-400/50"
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
