import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const localAssets = import.meta.glob("./IMAGENS/**/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const asset = (path) => localAssets[path];
const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const projects = [
  {
    title: { pt: "CHAPADA FC", en: "CHAPADA FC" },
    type: { pt: "FILME", en: "FILM" },
    tone: "stage",
    image: asset("./IMAGENS/CHAPADA FC/1.jpg"),
  },
  {
    title: { pt: "MORRO SAO JERONIMO", en: "SAO JERONIMO HILL" },
    type: { pt: "PUBLICIDADE", en: "ADVERTISING" },
    tone: "forest",
    image: asset("./IMAGENS/PORTIFOLIO/SnapInsta-Ai_3769520628320690220.jpg"),
  },
  {
    title: { pt: "UM DIA HISTORICO", en: "A HISTORIC DAY" },
    type: { pt: "FILME", en: "FILM" },
    tone: "street",
    image: asset("./IMAGENS/CHAPADA FC/9.jpg"),
  },
  {
    title: { pt: "GIRO", en: "PATROL" },
    type: { pt: "PUBLICIDADE", en: "ADVERTISING" },
    tone: "spotlight",
    image: asset("./IMAGENS/PORTIFOLIO/SnapInsta-Ai_3769520628211623645.jpg"),
  },
  {
    title: { pt: "AUTO FILME", en: "AUTO FILM" },
    type: { pt: "FILME", en: "FILM" },
    tone: "edit",
    image: asset("./IMAGENS/PORTIFOLIO/SnapInsta-Ai_3769520628362577069.jpg"),
  },
  {
    title: { pt: "EXPEDICAO", en: "EXPEDITION" },
    type: { pt: "PUBLICIDADE", en: "ADVERTISING" },
    tone: "motion",
    image: asset("./IMAGENS/PORTIFOLIO/SnapInsta-Ai_3769520628396140555.jpg"),
  },
  {
    title: { pt: "AR", en: "AIR" },
    type: { pt: "FILME", en: "FILM" },
    tone: "stage",
    image: asset("./IMAGENS/PORTIFOLIO/SnapInsta-Ai_3769520628320650357.jpg"),
  },
  {
    title: { pt: "CAMPO", en: "FIELD" },
    type: { pt: "FILME", en: "FILM" },
    tone: "forest",
    image: asset("./IMAGENS/CHAPADA FC/4.jpg"),
  },
];

const reelVideos = [
  {
    src: asset("./IMAGENS/VIDEO/SnapInsta-Ai_3458014243570817460.mp4"),
    title: { pt: "YAGUARA REEL", en: "YAGUARA REEL" },
  },
];

const jaguarVideos = [
  {
    src: publicAsset("assets/jaguar-videos/pantanal-jaguar.webm"),
    title: { pt: "PANTANAL", en: "PANTANAL" },
  },
  {
    src: publicAsset("assets/jaguar-videos/jaguars-couple.webm"),
    title: { pt: "OLHAR DUPLO", en: "DOUBLE GAZE" },
  },
  {
    src: publicAsset("assets/jaguar-videos/jaguars-playing.webm"),
    title: { pt: "INSTINTO EM MOVIMENTO", en: "INSTINCT IN MOTION" },
  },
];

const copy = {
  pt: {
    nav: ["INICIO", "PORTFOLIO", "QUEM E YAGUARA?", "CONTATO"],
    heroTitle: "AUDIOVISUAL COM INSTINTO",
    heroLine: "FILME / PUBLICIDADE / POS-PRODUCAO",
    watchReel: "ASSISTIR REEL",
    seeWork: "VER TRABALHOS",
    featured: "DESTAQUE",
    album: "PORTFOLIO",
    portfolio: "PORTFOLIO",
    what: "O QUE FAZEMOS",
    aboutTitle: "YAGUARA FILMS",
    aboutBody: [
      "Produtora audiovisual nascida no coracao do Mato Grosso, inspirada pela onca-pintada.",
      "Olhar preciso, presenca marcante e instinto para transformar historias em imagem.",
    ],
    chapterPrefix: "SECAO",
    marquee: ["YAGUARA FILMS", "QUEM PISCA PERDE", "OLHAR DE ONCA", "INSTINTO EM CADA CORTE", "A NOITE TAMBEM VE"],
    services: ["FILME", "PUBLICIDADE", "POS-PRODUCAO"],
    start: "INICIAR PROJETO",
    social: ["INSTAGRAM", "VIMEO", "EMAIL"],
  },
  en: {
    nav: ["HOME", "PORTFOLIO", "YAGUARA WHO?", "CONTACT"],
    heroTitle: "AUDIOVISUAL WITH INSTINCT",
    heroLine: "FILM / ADVERTISING / POST-PRODUCTION",
    watchReel: "WATCH REEL",
    seeWork: "SEE WORK",
    featured: "FEATURED WORK",
    album: "PORTFOLIO",
    portfolio: "PORTFOLIO",
    what: "WHAT WE DO",
    aboutTitle: "YAGUARA FILMS",
    aboutBody: [
      "An audiovisual production company born in Mato Grosso, inspired by the jaguar.",
      "Precise gaze, strong presence, and instinct to turn stories into images.",
    ],
    chapterPrefix: "SECTION",
    marquee: ["YAGUARA FILMS", "BLINK AND MISS IT", "JAGUAR GAZE", "INSTINCT IN EVERY CUT", "THE NIGHT WATCHES TOO"],
    services: ["FILM", "ADVERTISING", "POST-PRODUCTION"],
    start: "START A PROJECT",
    social: ["INSTAGRAM", "VIMEO", "EMAIL"],
  },
};

function useRotatingVideo(reducedMotion, delay = 5600, items = jaguarVideos) {
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setActiveVideo((current) => (current + 1) % items.length);
    }, delay);

    return () => window.clearInterval(timer);
  }, [delay, items.length, reducedMotion]);

  return activeVideo;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function ParticleEye({ reducedMotion }) {
  const group = useRef(null);
  const points = useRef(null);

  const { positions, colors } = useMemo(() => {
    const count = 2600;
    const positionArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);
    const amber = new THREE.Color("#d89b35");
    const bone = new THREE.Color("#efe8dc");
    const green = new THREE.Color("#244237");

    for (let i = 0; i < count; i += 1) {
      const t = Math.random() * Math.PI * 2;
      const ring = Math.random();
      const side = Math.random() > 0.5 ? 1 : -1;
      const eye = Math.pow(Math.sin(t), 2) * 0.34 + 0.1;
      const radiusX = 1.75 + ring * 2.15;
      const radiusY = eye + ring * 0.42;
      const jitter = (Math.random() - 0.5) * 0.26;

      positionArray[i * 3] = side * 1.55 + Math.cos(t) * radiusX + jitter;
      positionArray[i * 3 + 1] = Math.sin(t) * radiusY + (Math.random() - 0.5) * 0.25;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 2.8;

      const color = ring > 0.62 ? amber : Math.random() > 0.78 ? bone : green;
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    return { positions: positionArray, colors: colorArray };
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!group.current || reducedMotion) return;
    const elapsed = clock.getElapsedTime();
    group.current.rotation.z = Math.sin(elapsed * 0.16) * 0.04;
    group.current.rotation.y = pointer.x * 0.16;
    group.current.rotation.x = -pointer.y * 0.08;
    points.current.material.opacity = 0.76 + Math.sin(elapsed * 0.8) * 0.1;
  });

  return (
    <group ref={group} position={[2.15, 0.65, -1]} rotation={[0.02, -0.2, -0.02]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.04}
          sizeAttenuation
          transparent
          opacity={0.82}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function HeroScene({ reducedMotion }) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 44 }} dpr={[1, 1.8]}>
      <color attach="background" args={["#030302"]} />
      <fog attach="fog" args={["#030302", 6, 14]} />
      <ParticleEye reducedMotion={reducedMotion} />
      <ambientLight intensity={0.2} />
    </Canvas>
  );
}

function ScrollProgress({ labels }) {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState("01");

  useEffect(() => {
    const sections = [
      { id: "home", value: "01" },
      { id: "featured", value: "02" },
      { id: "portfolio", value: "03" },
      { id: "who", value: "04" },
      { id: "contact", value: "05" },
    ];

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);

      const active = sections
        .map((item) => {
          const element = document.getElementById(item.id);
          if (!element) return { ...item, distance: Number.POSITIVE_INFINITY };
          return { ...item, distance: Math.abs(element.getBoundingClientRect().top) };
        })
        .sort((a, b) => a.distance - b.distance)[0];

      if (active) setSection(active.value);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <aside className="scroll-progress" aria-label={`${labels.chapterPrefix} ${section}`}>
      <span>{section}</span>
      <div>
        <i style={{ transform: `scaleY(${progress})` }} />
      </div>
      <small>{labels.chapterPrefix}</small>
    </aside>
  );
}

function Header({ language, setLanguage, labels, onNavigate }) {
  return (
    <header className="site-header" aria-label="Navegacao principal">
      <a className="brand" href="#home" aria-label="Yaguara Films home" onClick={onNavigate}>
        <span>YAGUARA</span>
      </a>
      <nav>
        <a href="#home" onClick={onNavigate}>
          {labels.nav[0]}
        </a>
        <a href="#portfolio" onClick={onNavigate}>
          {labels.nav[1]}
        </a>
        <a href="#who" onClick={onNavigate}>
          {labels.nav[2]}
        </a>
        <a href="#contact" onClick={onNavigate}>
          {labels.nav[3]}
        </a>
      </nav>
      <div className="language-toggle" aria-label="Selecionar idioma">
        <button
          type="button"
          className={language === "pt" ? "active" : ""}
          onClick={() => setLanguage("pt")}
          aria-pressed={language === "pt"}
        >
          PT
        </button>
        <button
          type="button"
          className={language === "en" ? "active" : ""}
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
        >
          EN
        </button>
      </div>
      <button className="menu-button" aria-label="Abrir menu">
        <span />
        <span />
      </button>
    </header>
  );
}

function JaguarVideoStack({ activeVideo, language, reducedMotion, videos = jaguarVideos, className = "" }) {
  const active = videos[activeVideo];

  return (
    <div className={`jaguar-video-stack ${className}`} aria-label={active.title[language]}>
      {videos.map((video, index) => (
        <video
          key={video.src}
          className={index === activeVideo ? "active" : ""}
          src={video.src}
          muted
          loop
          autoPlay={!reducedMotion}
          playsInline
          preload="metadata"
        />
      ))}
      <div className="video-grade" aria-hidden="true" />
    </div>
  );
}

function ReelPanel({ reducedMotion, language }) {
  const activeVideo = useRotatingVideo(reducedMotion, 5600, reelVideos);
  const active = reelVideos[activeVideo];

  return (
    <div className="reel-panel" aria-label="Featured reel">
      <div className="reel-visual">
        <JaguarVideoStack activeVideo={activeVideo} language={language} reducedMotion={reducedMotion} videos={reelVideos} />
        <div className="rain-lines" />
      </div>
      <div className="reel-scene">
        <span>{String(activeVideo + 1).padStart(2, "0")}</span>
        <strong>{active.title[language]}</strong>
      </div>
      <div className="reel-controls">
        <button className="play-button" aria-label="Assistir reel" />
        <span>00:24</span>
        <div className="progress-track">
          <span key={activeVideo} />
        </div>
        <span>01:30</span>
      </div>
    </div>
  );
}

function MagneticButton({ children, href = "#portfolio", variant = "primary", onNavigate }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  const handleMove = (event) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: x * 0.18, y: y * 0.18, duration: 0.28, ease: "power2.out" });
  };

  const reset = () => {
    if (reducedMotion || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.45)" });
  };

  return (
    <a
      ref={ref}
      className={`magnetic-button ${variant}`}
      href={href}
      onClick={onNavigate}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </a>
  );
}

function Hero({ reducedMotion, labels, language, onNavigate }) {
  return (
    <section className="hero section-reveal" id="home">
      <div className="hero-canvas" aria-hidden="true">
        <HeroScene reducedMotion={reducedMotion} />
      </div>
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-gaze" aria-hidden="true" />
      <div className="scroll-rail" aria-hidden="true">
        <span>SCROLL</span>
        <i />
      </div>
      <div className="hero-copy">
        <h1>{labels.heroTitle}</h1>
        <p>{labels.heroLine}</p>
        <div className="hero-actions">
          <MagneticButton href="#featured" onNavigate={onNavigate}>
            {labels.watchReel}
          </MagneticButton>
          <MagneticButton href="#portfolio" variant="ghost" onNavigate={onNavigate}>
            {labels.seeWork}
          </MagneticButton>
        </div>
      </div>
      <ReelPanel reducedMotion={reducedMotion} language={language} />
    </section>
  );
}

function FeaturedWork({ labels, language, reducedMotion }) {
  const activeVideo = useRotatingVideo(reducedMotion, 6800, reelVideos);
  const active = reelVideos[activeVideo];

  return (
    <section className="featured section-reveal" id="featured">
      <div className="section-label">{labels.featured}</div>
      <div className="featured-frame">
        <div className="featured-media">
          <JaguarVideoStack activeVideo={activeVideo} language={language} reducedMotion={reducedMotion} videos={reelVideos} className="featured-video" />
          <div className="scanline" />
        </div>
        <div className="featured-meta">
          <span>{String(activeVideo + 1).padStart(2, "0")}</span>
          <strong>{active.title[language]}</strong>
        </div>
      </div>
    </section>
  );
}

function KineticStrip({ labels }) {
  const row = [...labels.marquee, ...labels.marquee];

  return (
    <section className="kinetic-strip" aria-hidden="true">
      <div>
        {row.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function VisualAlbum({ labels, language }) {
  const album = [...projects, ...projects];

  return (
    <section className="visual-album section-reveal" id="portfolio" aria-label={labels.album}>
      <div className="album-head">
        <span>{labels.album}</span>
        <small>01 / 06</small>
      </div>
      <div className="album-window">
        <div className="album-track">
          {album.map((project, index) => (
            <article
              className={`album-card tone-${project.tone}`}
              key={`${project.title.pt}-${index}`}
              aria-label={project.title[language]}
              style={{ "--work-image": `url(${project.image})` }}
            >
              <div className="album-image" />
              <div className="album-caption">
                <span>{String((index % projects.length) + 1).padStart(2, "0")}</span>
                <h3>{project.title[language]}</h3>
                <small>{project.type[language]}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectTile({ project, index, language }) {
  const title = project.title[language];

  return (
    <article className={`project-tile tone-${project.tone} section-reveal`} style={{ "--i": index }}>
      <div className="project-image" aria-hidden="true">
        <div className="project-depth one" />
        <div className="project-depth two" />
      </div>
      <div className="project-content">
        <small>{String(index + 1).padStart(2, "0")}</small>
        <span>{project.type[language]}</span>
        <h3>{title}</h3>
      </div>
      <button aria-label={`Assistir ${title}`} className="tile-play" />
    </article>
  );
}

function Portfolio({ labels, language }) {
  return (
    <section className="portfolio" id="portfolio">
      <div className="portfolio-head section-reveal">
        <h2>{labels.portfolio}</h2>
        <div className="portfolio-line" />
        <div className="portfolio-arrows" aria-hidden="true">
          <span className="arrow-left" />
          <span className="arrow-right" />
        </div>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectTile key={project.title.pt} project={project} index={index} language={language} />
        ))}
      </div>
    </section>
  );
}

function WhatWeDo({ labels }) {
  return (
    <section className="what section-reveal" id="who">
      <h2>{labels.what}</h2>
      <div className="about-panel" aria-label={labels.aboutTitle}>
        <div className="about-copy">
          <h3>{labels.aboutTitle}</h3>
          {labels.aboutBody.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
      <div className="service-strip">
        {labels.services.map((service) => (
          <span key={service}>{service}</span>
        ))}
      </div>
    </section>
  );
}

function FooterCta({ labels }) {
  return (
    <footer className="footer-cta section-reveal" id="contact">
      <div className="footer-eye" aria-hidden="true" />
      <MagneticButton href="mailto:hello@yaguarafilms.com" variant="round">
        {labels.start}
      </MagneticButton>
      <div className="footer-bottom">
        <span>YAGUARA FILMS</span>
        {labels.social.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </footer>
  );
}

function CursorLight() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const move = (event) => {
      if (!ref.current) return;
      ref.current.style.setProperty("--x", `${event.clientX}px`);
      ref.current.style.setProperty("--y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reducedMotion]);

  return <div className="cursor-light" ref={ref} aria-hidden="true" />;
}

function LoadingScreen({ progress, leaving }) {
  return (
    <div className={`loading-screen${leaving ? " is-leaving" : ""}`} role="status" aria-live="polite">
      <div className="loading-brand">YAGUARA</div>
      <div className="loading-copy">
        <span>CARREGANDO EXPERIÊNCIA</span>
        <strong>{String(Math.round(progress)).padStart(2, "0")}%</strong>
      </div>
      <div className="loading-track" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
    </div>
  );
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [language, setLanguage] = useState("pt");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loaderLeaving, setLoaderLeaving] = useState(false);
  const lenisRef = useRef(null);
  const labels = copy[language];

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const preloadReel = async () => {
      try {
        const response = await fetch(reelVideos[0].src, { signal: controller.signal });
        if (!response.ok || !response.body) throw new Error("Media preload failed");

        const total = Number(response.headers.get("content-length")) || 0;
        const reader = response.body.getReader();
        let loaded = 0;

        while (active) {
          const { done, value } = await reader.read();
          if (done) break;
          loaded += value.byteLength;
          if (total) setLoadingProgress(Math.min(96, (loaded / total) * 96));
        }
      } catch (error) {
        if (error.name === "AbortError") return;
      }

      if (!active) return;
      setLoadingProgress(100);
      window.setTimeout(() => setLoaderLeaving(true), 180);
      window.setTimeout(() => setLoading(false), 850);
    };

    preloadReel();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", loading);
    return () => document.documentElement.classList.remove("is-loading");
  }, [loading]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      infinite: false,
    });

    lenisRef.current = lenis;

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const handleNavigate = (event) => {
    const href = event.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;

    event.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    if (reducedMotion || !lenisRef.current) {
      target.scrollIntoView({ block: "start" });
      return;
    }

    lenisRef.current.scrollTo(target, {
      offset: 0,
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    });
  };

  useEffect(() => {
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".section-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
            },
          },
        );
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
          },
        })
        .to(".hero-canvas", { scale: 1.18, yPercent: 12, ease: "none" }, 0)
        .to(".hero-gaze", { yPercent: -18, scale: 1.12, opacity: 0.92, ease: "none" }, 0)
        .to(".hero-copy", { yPercent: -22, opacity: 0.58, ease: "none" }, 0)
        .to(".reel-panel", { yPercent: -34, rotateY: 5, rotateX: -2, ease: "none" }, 0);

      gsap.utils.toArray(".project-tile").forEach((tile, index) => {
        gsap.fromTo(
          tile,
          {
            clipPath: "inset(18% 0 18% 0)",
            rotateX: index % 2 === 0 ? -10 : 10,
            y: 120,
          },
          {
            clipPath: "inset(0% 0 0% 0)",
            rotateX: 0,
            y: 0,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: tile,
              start: "top 88%",
              end: "top 42%",
              scrub: 0.8,
            },
          },
        );
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".featured-frame",
            start: "top 86%",
            end: "bottom 38%",
            scrub: 0.9,
          },
        })
        .fromTo(".featured-media", { scale: 1.12, rotateZ: -1.8 }, { scale: 1, rotateZ: 0, ease: "none" })
        .fromTo(".featured-meta", { xPercent: -12 }, { xPercent: 4, ease: "none" }, 0);

      gsap.fromTo(
        ".service-strip span",
        { yPercent: 80, opacity: 0.08 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".what",
            start: "top 75%",
            end: "center 44%",
            scrub: 0.7,
          },
        },
      );

      gsap.fromTo(
        ".footer-eye",
        { scale: 0.75, rotate: -10, opacity: 0.22 },
        {
          scale: 1.25,
          rotate: 5,
          opacity: 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-cta",
            start: "top 85%",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      {loading && <LoadingScreen progress={loadingProgress} leaving={loaderLeaving} />}
      <CursorLight />
      <ScrollProgress labels={labels} />
      <Header language={language} setLanguage={setLanguage} labels={labels} onNavigate={handleNavigate} />
      <main>
        <Hero reducedMotion={reducedMotion} labels={labels} language={language} onNavigate={handleNavigate} />
        <FeaturedWork labels={labels} language={language} reducedMotion={reducedMotion} />
        <KineticStrip labels={labels} />
        <VisualAlbum labels={labels} language={language} />
        <WhatWeDo labels={labels} />
        <FooterCta labels={labels} />
      </main>
    </>
  );
}
