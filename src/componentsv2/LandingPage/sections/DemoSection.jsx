import React, { useEffect, useRef, useState } from 'react';
import './DemoSection.scss';
import { useTranslation } from 'react-i18next';
import { PlayIcon, PauseIcon } from '../../../constants/icons';

const VIMEO_URL =
  'https://player.vimeo.com/video/1207723573?badge=0&autopause=0&player_id=0&app_id=58479&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1';

const VIMEO_PLAYER_SCRIPT_SRC = 'https://player.vimeo.com/api/player.js';

const DemoSection = () => {
  const { t } = useTranslation();
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!VIMEO_URL) return undefined;
    let cancelled = false;

    const attachPlayer = () => {
      if (cancelled || !iframeRef.current || !window.Vimeo) return;
      const player = new window.Vimeo.Player(iframeRef.current);
      playerRef.current = player;
      player.on('play', () => setIsPlaying(true));
      player.on('pause', () => setIsPlaying(false));
      player.on('ended', () => setIsPlaying(false));
    };

    if (window.Vimeo?.Player) {
      attachPlayer();
    } else {
      let script = document.querySelector(`script[src="${VIMEO_PLAYER_SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement('script');
        script.src = VIMEO_PLAYER_SCRIPT_SRC;
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener('load', attachPlayer);
    }

    return () => {
      cancelled = true;
      playerRef.current?.off('play');
      playerRef.current?.off('pause');
      playerRef.current?.off('ended');
    };
  }, []);

  const handleToggle = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <section id="demo" className="demo-section">
      <span className="demo-section__eyebrow">{t('landing.demo.eyebrow', 'Demo')}</span>
      <h2 className="demo-section__title">{t('landing.demo.title', 'How adorCV works')}</h2>
      <p className="demo-section__subtitle">
        {t('landing.demo.subtitle', 'Watch how adorCV transforms the recruitment process end-to-end in under 2 minutes.')}
      </p>

      <div className="demo-section__video">
        {VIMEO_URL ? (
          <>
            <iframe
              ref={iframeRef}
              className="demo-section__iframe"
              src={VIMEO_URL}
              title={t('landing.demo.videoTitle', 'adorCV demo')}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <button
              type="button"
              className={`demo-section__toggle${isPlaying ? ' demo-section__toggle--playing' : ''}`}
              onClick={handleToggle}
              aria-label={isPlaying ? t('landing.demo.pause', 'Pause video') : t('landing.demo.play', 'Play video')}
            >
              <span className="demo-section__toggle-icon">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </span>
            </button>
          </>
        ) : (
          <div className="demo-section__placeholder">
            <div className="demo-section__play-btn">
              <PlayIcon />
            </div>
            <span className="demo-section__caption">
              {t('landing.demo.caption', 'adorCV demo — 2 min')}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default DemoSection;
