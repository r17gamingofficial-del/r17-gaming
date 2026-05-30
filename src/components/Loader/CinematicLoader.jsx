import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import './CinematicLoader.css';

export default function CinematicLoader({
  onComplete,
  onTransitionStart,
}) {
  const containerRef = useRef(null);

  const onCompleteRef = useRef(onComplete);
  const onTransitionStartRef = useRef(onTransitionStart);

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
    onTransitionStartRef.current = onTransitionStart;
  }, [onComplete, onTransitionStart]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      gsap.set(
        `
        .loader-hud-wrapper,
        .loader-outer-ring,
        .loader-inner-rings,
        .loader-ring-1,
        .loader-ring-2,
        .loader-ring-3,
        .loader-energy-ring,
        .loader-radar-dots,
        .loader-target-markers,
        .reactor-scan
        `,
        {
          transformOrigin: '50% 50%',
        }
      );

      gsap.set(
        `
        .loader-outer-ring,
        .loader-inner-rings,
        .loader-pulse
        `,
        {
          scale: 0,
          opacity: 0,
        }
      );

      gsap.set('.loader-logo-img', {
        opacity: 0,
      });

      gsap.set('.loader-logo-txt', {
        opacity: 0,
      });

      tl.to('.loader-line-left, .loader-line-right', {
        width: '50%',
        duration: 1.5,
        ease: 'power2.inOut',
      });

      tl.to(
        '.loader-pulse',
        {
          scale: 6,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.2'
      );

      tl.addLabel('rings-expand', '-=0.5');

      tl.to(
        '.loader-outer-ring',
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
        },
        'rings-expand'
      );

      tl.to(
        '.loader-line-left',
        {
          x: -300,
          duration: 1.3,
          ease: 'power3.out',
        },
        'rings-expand'
      );

      tl.to(
        '.loader-line-right',
        {
          x: 300,
          duration: 1.3,
          ease: 'power3.out',
        },
        'rings-expand'
      );

      tl.to(
        '.loader-inner-rings',
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
        },
        '-=1'
      );

      tl.add(() => {
        gsap.to('.loader-ring-1', {
          rotation: 360,
          duration: 45,
          repeat: -1,
          ease: 'none',
        });

        gsap.to('.loader-ring-2', {
          rotation: -360,
          duration: 30,
          repeat: -1,
          ease: 'none',
        });

        gsap.to('.loader-ring-3', {
          rotation: 360,
          duration: 12,
          repeat: -1,
          ease: 'none',
        });

        gsap.to('.loader-energy-ring', {
          rotation: -360,
          duration: 8,
          repeat: -1,
          ease: 'none',
        });

        gsap.to('.loader-radar-dots', {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'none',
        });

        gsap.to('.reactor-scan', {
          rotation: 360,
          duration: 4,
          repeat: -1,
          ease: 'none',
        });
      });

      tl.addLabel('logo-appear', '-=0.2');

      tl.fromTo(
        '.loader-logo-img',
        {
          opacity: 0,
          scale: 0.8,
          filter: 'blur(12px)',
        },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.6,
          ease: 'power3.out',
        },
        'logo-appear'
      );

      tl.addLabel('glitch', '+=0.4');

      tl.set(
        '.layer-glitch-1, .layer-glitch-2',
        {
          opacity: 1,
        },
        'glitch'
      );

      tl.to(
        '.layer-glitch-1',
        {
          x: () => Math.random() * 18 - 9,
          repeat: 10,
          yoyo: true,
          ease: 'steps(1)',
          duration: 0.05,
        },
        'glitch'
      );

      tl.to(
        '.layer-glitch-2',
        {
          x: () => Math.random() * 18 - 9,
          repeat: 10,
          yoyo: true,
          ease: 'steps(1)',
          duration: 0.05,
        },
        'glitch'
      );

      tl.set(
        '.loader-logo-img',
        {
          opacity: 0,
        },
        'glitch+=0.25'
      );

      tl.set(
        '.loader-logo-txt',
        {
          opacity: 1,
        },
        'glitch+=0.25'
      );

      tl.set(
        '.layer-glitch-1, .layer-glitch-2',
        {
          opacity: 0,
        },
        'glitch+=0.5'
      );

      tl.fromTo(
        '.loader-logo-txt',
        {
          scale: 1.06,
          letterSpacing: '0.3em',
          opacity: 0,
          filter: 'blur(10px)',
        },
        {
          scale: 1,
          letterSpacing: '0.18em',
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.5,
          ease: 'power3.out',
        },
        'glitch+=0.45'
      );

      tl.to({}, { duration: 1.5 });

      tl.addLabel('exit');

      tl.add(() => {
        if (onTransitionStartRef.current) {
          onTransitionStartRef.current();
        }
      }, 'exit');

      tl.to(
        '.loader-master-glitch-container',
        {
          x: () => Math.random() * 20 - 10,
          y: () => Math.random() * 10 - 5,
          scale: 1.03,
          duration: 0.05,
          repeat: 8,
          yoyo: true,
          ease: 'steps(1)',
        },
        'exit'
      );

      tl.to(
        '.cinematic-loader-overlay',
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power3.inOut',
          onComplete: () => {
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          },
        },
        'exit+=0.1'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      className="cinematic-loader-overlay"
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loader-master-glitch-container">

        <div className="loader-atmosphere" />

        <div className="loader-scanlines" />

        {/* CENTER LINES */}
        <div className="loader-layer loader-line-layer">

          <div className="loader-line-left">
            <div className="loader-endpoint-right">
              <div className="endpoint-tick" />
              <div className="endpoint-box" />
              <div className="endpoint-dot" />
            </div>
          </div>

          <div className="loader-line-right">
            <div className="loader-endpoint-left">
              <div className="endpoint-tick" />
              <div className="endpoint-box" />
              <div className="endpoint-dot" />
            </div>
          </div>

        </div>

        {/* PULSE */}
        <div className="loader-pulse" />

        {/* SVG HUD */}
        <div className="loader-layer loader-svg-layer">

          <svg viewBox="0 0 800 800" className="loader-svg">

            <defs>

              <linearGradient
                id="reactorGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#cc1122" />
                <stop offset="50%" stopColor="#ff3040" />
                <stop offset="100%" stopColor="#aa0011" />
              </linearGradient>

            </defs>

            <g className="loader-hud-wrapper">

              {/* OUTER MAIN RING */}
              <g className="loader-outer-ring">

                <circle
                  cx="400"
                  cy="400"
                  r="330"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  fill="none"
                />

                <circle
                  cx="400"
                  cy="400"
                  r="330"
                  stroke="#ff3040"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="0 260 18 40 10 300"
                />

              </g>

              <g className="loader-inner-rings">

                {/* OUTER SCALE RING */}
                <g className="loader-ring-1">

                  <circle
                    cx="400"
                    cy="400"
                    r="300"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="2 10"
                  />

                  <circle
                    cx="400"
                    cy="400"
                    r="300"
                    stroke="#ff3040"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="0 180 18 40 12 220"
                  />

                </g>

                {/* SECONDARY OUTER RING */}
                <g className="loader-ring-2">

                  <circle
                    cx="400"
                    cy="400"
                    r="255"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="120 40 40 100"
                  />

                  <circle
                    cx="400"
                    cy="400"
                    r="255"
                    stroke="#ff3040"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="0 220 28 70 18 260"
                  />

                </g>

                {/* TARGET MARKERS */}
                <g className="loader-target-markers">

                  <path
                    d="M400 120 L400 150"
                    stroke="#ff3040"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <path
                    d="M400 650 L400 680"
                    stroke="#ff3040"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <path
                    d="M120 400 L150 400"
                    stroke="#ff3040"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <path
                    d="M650 400 L680 400"
                    stroke="#ff3040"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                </g>

                {/* RADAR DOTS */}
                <g className="loader-radar-dots">

                  <circle cx="400" cy="145" r="4" fill="#ffffff" />
                  <circle cx="655" cy="400" r="4" fill="#ff3040" />
                  <circle cx="545" cy="610" r="3" fill="#ffffff" />
                  <circle cx="255" cy="610" r="3" fill="#ff3040" />
                  <circle cx="160" cy="270" r="3" fill="#ffffff" />
                  <circle cx="570" cy="205" r="3" fill="#ff3040" />

                </g>

                {/* MAIN REACTOR RING */}
                <g className="loader-ring-3">

                  <circle
                    cx="400"
                    cy="400"
                    r="185"
                    stroke="rgba(255,48,64,0.12)"
                    strokeWidth="10"
                    fill="none"
                  />

                  <circle
                    cx="400"
                    cy="400"
                    r="185"
                    stroke="#ff3040"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="240 80"
                    strokeLinecap="round"
                  />

                </g>

              </g>

            </g>

          </svg>

        </div>

        {/* LOGO */}
        <div className="loader-layer z-10">

          <div className="loader-identity-container">

            <div className="loader-identity-layer layer-base">

              <img
                src="/assets/LogoR17.png"
                alt="R17 Emblem"
                className="loader-logo-img"
              />

              <span
                className="loader-logo-txt"
                data-text="R17"
              >
                R17
              </span>

            </div>

            <div className="loader-identity-layer layer-glitch-1">

              <img
                src="/assets/LogoR17.png"
                alt=""
                className="loader-logo-img"
              />

              <span
                className="loader-logo-txt"
                data-text="R17"
              >
                R17
              </span>

            </div>

            <div className="loader-identity-layer layer-glitch-2">

              <img
                src="/assets/LogoR17.png"
                alt=""
                className="loader-logo-img"
              />

              <span
                className="loader-logo-txt"
                data-text="R17"
              >
                R17
              </span>

            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
}