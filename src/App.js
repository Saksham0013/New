import React, { useState, useEffect, useRef } from "react";
import "./App.css";

/* 🔥 FIREWORKS INSIDE SAME FILE */
function Fireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let fireworks = [];
    let particles = [];

    class Firework {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.4;
        this.speed = 5 + Math.random() * 3;
        this.color = `hsl(${Math.random() * 360},100%,60%)`;
      }

      update() {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          explode(this.x, this.y, this.color);
          return true;
        }
        return false;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 6 + 2;
        this.life = 100;
        this.gravity = 0.05;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
      }

      update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const explode = (x, y, color) => {
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.05) {
        fireworks.push(new Firework());
      }

      fireworks = fireworks.filter(fw => {
        fw.draw();
        return !fw.update();
      });

      particles = particles.filter(p => {
        p.update();
        p.draw();
        return p.life > 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}

/* 🎯 TARGET DATE */
const TARGET_DATE = new Date(" January 1, 2026 00:00:00").getTime();

function App() {
  // ⬇️ START FROM COUNTDOWN
  const [page, setPage] = useState("countdown");
  const [timeLeft, setTimeLeft] = useState({});
  const [showFireworks, setShowFireworks] = useState(false);
  const [showNewYearMessage, setShowNewYearMessage] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = TARGET_DATE - now;

      if (diff <= 0) {
        clearInterval(timer);

        setShowFireworks(true);
        setPage("newyear");

        // Fireworks duration
        setTimeout(() => {
          setShowFireworks(false);
          setShowNewYearMessage(true);

          // After Happy New Year → Intro
          setTimeout(() => {
            setShowNewYearMessage(false);
            setPage("intro");
          }, 3000);

        }, 5000);

      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-wrapper">

      {/* 🎆 FIREWORKS */}
      {showFireworks && <Fireworks />}

      {/* 🎉 HAPPY NEW YEAR OVERLAY */}
      {showNewYearMessage && (
        <div className="newyear-overlay">
          <h1>🎉 Happy New Year 🎉</h1>
          <p>Welcome to our beautiful new chapter ❤️</p>

          <button
            className="continue-btn"
            onClick={() => {
              setShowNewYearMessage(false);
              setPage("intro");
            }}
          >
            Continue ❤️
          </button>
        </div>
      )}

      <div className={`container ${showNewYearMessage ? "blur-hide" : ""}`}>

        {page === "intro" && (
          <>
            <h1>Hi My Beautiful Girl 💖</h1>
            <p>I got a surprise for you</p>
            <div className="btn-group">
              <button onClick={() => setPage("ready")}>YES</button>
              <button onClick={() => setPage("no")}>NO</button>
            </div>
          </>
        )}

        {page === "no" && (
          <>
            <h1>How dare you 😤</h1>
            <button onClick={() => setPage("intro")}>TRY AGAIN</button>
          </>
        )}

        {page === "ready" && (
          <>
            <h1>Are you ready? 🥺</h1>
            <button onClick={() => setPage("newyear")}>YES</button>
          </>
        )}

        {page === "countdown" && (
          <>
            <h1>Open when it’s</h1>
            <div className="timer">
              <div><span>{timeLeft.days}</span><small>DAYS</small></div>
              <div><span>{timeLeft.hours}</span><small>HOURS</small></div>
              <div><span>{timeLeft.minutes}</span><small>MINS</small></div>
              <div><span>{timeLeft.seconds}</span><small>SECS</small></div>
            </div>
            <p className="note">New Year 🎆</p>
          </>
        )}

        {page === "newyear" && (
          <>
            <h1>Happy New Year 🎉</h1>
            <h2>My Beautiful Girl ❤️</h2>
            <p>
              As the New Year begins, I’m wishing you a year filled with confidence, peace, and endless smiles.💕
              May every new day bring you closer to your dreams and remind you of how strong you are.🫂
              I hope this year gives you beautiful memories, good health, and moments worth celebrating.❤️
              Thank you for being such a kind and supportive who makes life brighter.
              Here’s to a fresh start and a wonderful year ahead for you 🌸✨
            </p>
            <button onClick={() => setPage("gifts")}>NEXT 🎁</button>
          </>
        )}

        {page === "gifts" && (
          <>
            <h1>Gifts For You 🎁</h1>
            <div className="gift-grid">
              <div onClick={() => setPage("letter")}>💌</div>
              <div onClick={() => setPage("bouquet")}>🌹</div>
              <div onClick={() => setPage("memories")}>💿</div>
              <div onClick={() => setPage("moments")}>📸</div>
            </div>
            {/* <button className="back" onClick={() => setPage("newyear")}>BACK</button> */}
          </>
        )}

        {page === "letter" && (
          <>
            <h1>💌 My Letter</h1>
            <p className="text">
              As we step into a brand-new year, I just want to send you my warmest wishes. May the coming months bring you calm days, exciting opportunities, and the strength to handle whatever comes your way. You have a way of making people feel comfortable and valued, and that’s something truly special.

              I’m grateful for the laughter, conversations, and support we’ve shared, and I hope this year gives you many moments that make you proud of yourself. May happiness find you often, and may your efforts turn into success.

              Wishing you a peaceful and joyful New Year.✨🎊
            </p>
            <button onClick={() => setPage("gifts")}>BACK</button>
          </>
        )}

        {page === "bouquet" && (
          <>
            <h1>🌹 Virtual Bouquet</h1>
            <p className="text">
              Until I see you again, let this bouquet carry my warmth to you.
              May each flower remind you that you are thought of and truly appreciated.
              Let its colors brighten your days and bring a gentle smile to your face.
              May it hold my good wishes for your happiness and peace.
              Until we meet again, let it speak all the care I’m sending your way.
            </p>
            <button onClick={() => setPage("gifts")}>BACK</button>
          </>
        )}
        {/* 
        {page === "music" && (
          <>
            <h1>🎵 Our Song</h1>
            <audio controls autoPlay>
              <source src="/your-song.mp3" type="audio/mpeg" />
            </audio>
            <button onClick={() => setPage("gifts")}>BACK</button>
          </>
        )} */}

        {page === "memories" && (
          <>
            <h1>💿 Memories</h1>
            <p className="text">
              I often find myself smiling at the memories we’ve created together, from simple conversations to moments that felt unexpectedly special.
              Those shared laughs and quiet talks still stay with me, bringing comfort and warmth.
              No matter how much time passes, those memories remain a beautiful part of my days.
            </p>
            <button onClick={() => setPage("gifts")}>BACK</button>
          </>
        )}

        {page === "moments" && (
          <>
            <h1>📸 Best Moments</h1>
            <p className="text">
              Some of the best moments of ours are the ones that happened so naturally, without any planning.
              The laughter we shared and the small, meaningful conversations made those times unforgettable.
              Even now, those moments remain close to my heart and always bring a smile.
              Every laugh, every memory, every second with you is my favorite.🤌❤️
            </p>
            <button onClick={() => setPage("gifts")}>BACK</button>
          </>
        )}

      </div>
    </div>
  );
}

export default App;
