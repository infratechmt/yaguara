import { useEffect, useRef, useState } from "react";

const localAssets = import.meta.glob("./IMAGENS/**/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const asset = (path) => localAssets[path];
const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const preloadImage = (src) =>
  new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }

    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if (image.decode) {
      image.decode().then(resolve).catch(resolve);
    }
  });

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

const mainPageImages = [
  publicAsset("assets/jaguar-eye-hero.png"),
  publicAsset("assets/portfolio-stills.png"),
  publicAsset("assets/jaguar-eye-footer.png"),
  ...projects.map((project) => project.image),
].filter(Boolean);
const uniqueMainPageImages = [...new Set(mainPageImages)];

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

function ScrollProgress({ labels }) {
  const progressRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const sections = [
      { id: "home", value: "01" },
      { id: "featured", value: "02" },
      { id: "portfolio", value: "03" },
      { id: "who", value: "04" },
      { id: "contact", value: "05" },
    ];

    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${progress})`;

      const active = sections
        .map((item) => {
          const element = document.getElementById(item.id);
          if (!element) return { ...item, distance: Number.POSITIVE_INFINITY };
          return { ...item, distance: Math.abs(element.getBoundingClientRect().top) };
        })
        .sort((a, b) => a.distance - b.distance)[0];

      if (active && sectionRef.current) sectionRef.current.textContent = active.value;
      frame = 0;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <aside className="scroll-progress" aria-label={labels.chapterPrefix}>
      <span ref={sectionRef}>01</span>
      <div>
        <i ref={progressRef} />
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
    </header>
  );
}

function JaguarVideoStack({ activeVideo, language, reducedMotion, videos = jaguarVideos, className = "" }) {
  const active = videos[activeVideo];
  const stackRef = useRef(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return undefined;

    const syncPlayback = (visible) => {
      stack.querySelectorAll("video").forEach((video, index) => {
        if (visible && index === activeVideo && !reducedMotion) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => syncPlayback(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.05 },
    );

    observer.observe(stack);
    return () => {
      observer.disconnect();
      syncPlayback(false);
    };
  }, [activeVideo, reducedMotion]);

  return (
    <div ref={stackRef} className={`jaguar-video-stack ${className}`} aria-label={active.title[language]}>
      {videos.map((video, index) => (
        <video
          key={video.src}
          className={index === activeVideo ? "active" : ""}
          src={video.src}
          muted
          loop
          playsInline
          preload={index === activeVideo ? "metadata" : "none"}
        />
      ))}
      <div className="video-grade" aria-hidden="true" />
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
    ref.current.style.transform = `translate3d(${x * 0.12}px, ${y * 0.12}px, 0)`;
  };

  const reset = () => {
    if (reducedMotion || !ref.current) return;
    ref.current.style.transform = "translate3d(0, 0, 0)";
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

function Hero({ labels, onNavigate }) {
  return (
    <section className="hero section-reveal" id="home">
      <div className="hero-canvas" aria-hidden="true">
      </div>
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-gaze" aria-hidden="true" />
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

function VisualAlbum({ labels, language }) {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (!selectedProject) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedProject(null);
    };

    document.documentElement.classList.add("is-modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.classList.remove("is-modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <>
      <section className="visual-album section-reveal" id="portfolio" aria-label={labels.album}>
        <div className="album-head">
          <span>{labels.album}</span>
          <small>01 / 08</small>
        </div>
        <div className="album-window">
          <div className="album-grid">
            {projects.map((project, index) => (
              <div className={`album-block tone-${project.tone}`} key={project.title.pt}>
                <div className="album-pretitle">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{project.type[language]}</small>
                </div>
                <button
                  type="button"
                  className="album-card"
                  aria-label={`${project.title[language]} - ampliar imagem`}
                  style={{ "--work-image": `url(${project.image})` }}
                  onClick={() => setSelectedProject(project)}
                >
                  <span className="album-image" />
                  <div className="album-caption">
                    <h3>{project.title[language]}</h3>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedProject && (
        <div className="album-lightbox" role="dialog" aria-modal="true" aria-label={selectedProject.title[language]}>
          <button
            type="button"
            className="lightbox-backdrop"
            aria-label="Fechar imagem"
            onClick={() => setSelectedProject(null)}
          />
          <div className="lightbox-content">
            <img src={selectedProject.image} alt={selectedProject.title[language]} />
            <div className="lightbox-caption">
              <span>{selectedProject.type[language]}</span>
              <h3>{selectedProject.title[language]}</h3>
            </div>
            <button type="button" className="lightbox-close" aria-label="Fechar imagem" onClick={() => setSelectedProject(null)}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
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
        <div className="about-scratches" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
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

function FooterCta({ labels, onNavigate }) {
  return (
    <footer className="footer-cta section-reveal" id="contact">
      <div className="footer-eye" aria-hidden="true" />
      <MagneticButton href="mailto:hello@yaguarafilms.com" variant="round">
        {labels.start}
      </MagneticButton>
      <div className="footer-bottom">
        <span>YAGUARA FILMS</span>
        <a href="https://www.instagram.com/yaguara.films/" target="_blank" rel="noreferrer">
          INSTAGRAM
        </a>
      </div>
    </footer>
  );
}


function CursorLight() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;
    let frame = 0;
    let x = 0;
    let y = 0;

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.setProperty("--x", `${x}px`);
          ref.current.style.setProperty("--y", `${y}px`);
        }
        frame = 0;
      });
    };

    window.addEventListener("pointermove", move);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, [reducedMotion]);

  return <div className="cursor-light" ref={ref} aria-hidden="true" />;
}

function LoadingScreen({ progress, leaving }) {
  const animatedWord = (word) =>
    [...word].map((letter, index) => (
      <span key={`${word}-${index}`} style={{ "--letter-index": index }} aria-hidden="true">
        {letter}
      </span>
    ));

  return (
    <div className={`loading-screen${leaving ? " is-leaving" : ""}`} role="status" aria-live="polite">
      <div className="loading-eye" aria-hidden="true" />
      <div className="loading-brand" aria-label="Yaguara Films">
        <div className="loading-yaguara">{animatedWord("YAGUARA")}</div>
        <div className="loading-films">{animatedWord("FILMS")}</div>
      </div>
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
  const labels = copy[language];

  useEffect(() => {
    let active = true;
    let finished = false;
    let finishTimer = 0;
    const startedAt = performance.now();
    const minimumVisibleTime = 2400;
    const preloader = document.createElement("video");
    const totalSteps = uniqueMainPageImages.length + 1;
    let completedSteps = 0;

    const markStepComplete = () => {
      if (!active) return;
      completedSteps += 1;
      setLoadingProgress((value) => Math.max(value, Math.min(96, (completedSteps / totalSteps) * 96)));
    };

    const finishLoading = () => {
      if (!active || finished) return;
      finished = true;
      const remainingTime = Math.max(0, minimumVisibleTime - (performance.now() - startedAt));

      finishTimer = window.setTimeout(() => {
        if (!active) return;
        setLoadingProgress(100);
        window.setTimeout(() => setLoaderLeaving(true), 180);
        window.setTimeout(() => setLoading(false), 850);
      }, remainingTime);
    };

    const updateBufferedProgress = () => {
      if (!active || !preloader.duration || !preloader.buffered.length) return;
      const buffered = preloader.buffered.end(preloader.buffered.length - 1);
      const videoShare = 1 / totalSteps;
      setLoadingProgress((value) => Math.max(value, Math.min(92, (buffered / preloader.duration) * videoShare * 96)));
    };

    preloader.muted = true;
    preloader.preload = "auto";
    preloader.playsInline = true;
    preloader.src = reelVideos[0].src;
    preloader.addEventListener("loadedmetadata", () => setLoadingProgress((value) => Math.max(value, 28)));
    preloader.addEventListener("progress", updateBufferedProgress);
    const videoReady = new Promise((resolve) => {
      let resolved = false;
      const completeVideo = () => {
        if (resolved) return;
        resolved = true;
        markStepComplete();
        resolve();
      };

      preloader.addEventListener("canplay", completeVideo, { once: true });
      preloader.addEventListener("error", completeVideo, { once: true });
    });
    preloader.load();

    const imagePreloads = uniqueMainPageImages.map((src) => preloadImage(src).then(markStepComplete));
    Promise.all([...imagePreloads, videoReady]).then(finishLoading);

    const progressTimer = window.setInterval(() => {
      setLoadingProgress((value) => Math.min(90, value + (90 - value) * 0.08 + 0.4));
    }, 180);
    const safetyTimer = window.setTimeout(finishLoading, 6500);

    return () => {
      active = false;
      window.clearTimeout(finishTimer);
      window.clearInterval(progressTimer);
      window.clearTimeout(safetyTimer);
      preloader.removeAttribute("src");
      preloader.load();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", loading);
    return () => document.documentElement.classList.remove("is-loading");
  }, [loading]);

  const handleNavigate = (event) => {
    const href = event.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;

    event.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    target.scrollIntoView({
      block: "start",
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      {loading && <LoadingScreen progress={loadingProgress} leaving={loaderLeaving} />}
      <CursorLight />
      <ScrollProgress labels={labels} />
      <Header language={language} setLanguage={setLanguage} labels={labels} onNavigate={handleNavigate} />
      <main>
        <Hero labels={labels} onNavigate={handleNavigate} />
        <FeaturedWork labels={labels} language={language} reducedMotion={reducedMotion} />
        <VisualAlbum labels={labels} language={language} />
        <WhatWeDo labels={labels} />
        <FooterCta labels={labels} onNavigate={handleNavigate} />
      </main>
    </>
  );
}
