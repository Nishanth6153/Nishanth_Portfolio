import { useEffect, useRef, useState } from 'react'
import type { PortfolioSection } from '../core/SceneStateMachine'
import { SITE } from '../content/site'

const SECTIONS: readonly PortfolioSection[] = ['about', 'work', 'posts', 'online', 'video']

export function MonitorDesktop({ section, video, videoAvailable, onSection }: {
  section: PortfolioSection
  video: HTMLVideoElement | null
  videoAvailable: boolean
  onSection: (section: PortfolioSection) => void
}) {
  return <main className="monitor-desktop" aria-label="Interactive portfolio computer">
    <header className="monitor-desktop__bar"><span className="monitor-desktop__brand">{SITE.name || SITE.title}</span><span>LOCAL PORTFOLIO</span></header>
    <nav className="monitor-desktop__tabs" aria-label="Monitor desktop windows">
      {SECTIONS.map(name => <button key={name} type="button" aria-pressed={section === name} onClick={() => onSection(name)}>{name}</button>)}
    </nav>
    <section className="monitor-desktop__window" aria-live="polite">
      <h2>{section === 'video' ? 'Video Player' : section[0].toUpperCase() + section.slice(1)}</h2>
      {section === 'about' && <About />}
      {section === 'work' && <Work />}
      {section === 'posts' && <Posts />}
      {section === 'online' && <Online />}
      {section === 'video' && <VideoPlayer video={video} available={videoAvailable} />}
    </section>
    <footer className="monitor-desktop__status"><span>PORTFOLIO SYSTEM</span><span>ESC · BACK TO ROOM</span></footer>
  </main>
}

function About() {
  return SITE.biography.length
    ? <div>{SITE.biography.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    : <p className="monitor-empty">Owner-approved biography has not been supplied.</p>
}

function Work() {
  return SITE.projects.length
    ? <ul className="monitor-list">{SITE.projects.map(project => <li key={project.name}><strong>{project.name}</strong><p>{project.summary}</p>{project.href && <a href={project.href} target="_blank" rel="noreferrer">Open project</a>}</li>)}</ul>
    : <p className="monitor-empty">No owner-approved projects have been supplied.</p>
}

function Posts() {
  return SITE.posts.length
    ? <ul className="monitor-list">{SITE.posts.map(post => <li key={post.title}><strong>{post.title}</strong><span>{post.date}</span>{post.href && <a href={post.href} target="_blank" rel="noreferrer">Read post</a>}</li>)}</ul>
    : <p className="monitor-empty">No owner-approved posts have been supplied.</p>
}

function Online() {
  const profiles = SITE.profiles.filter(profile => profile.url)
  return profiles.length || SITE.email
    ? <ul className="monitor-list">{profiles.map(profile => <li key={profile.label}><a href={profile.url} target="_blank" rel="noreferrer">{profile.label}</a></li>)}{SITE.email && <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>}</ul>
    : <p className="monitor-empty">No contact or profile links have been supplied.</p>
}

function VideoPlayer({ video, available }: { video: HTMLVideoElement | null; available: boolean }) {
  const playerRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.65)
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    const sync = () => setCurrentTime(player.currentTime || 0)
    const loaded = () => setDuration(Number.isFinite(player.duration) ? player.duration : 0)
    const started = () => setPlaying(true)
    const paused = () => setPlaying(false)
    player.addEventListener('timeupdate', sync)
    player.addEventListener('loadedmetadata', loaded)
    player.addEventListener('play', started)
    player.addEventListener('pause', paused)
    return () => {
      player.removeEventListener('timeupdate', sync)
      player.removeEventListener('loadedmetadata', loaded)
      player.removeEventListener('play', started)
      player.removeEventListener('pause', paused)
    }
  }, [available])

  if (!available || !video) return <div className="monitor-video-missing" role="status">
    <div className="monitor-video-missing__screen">VIDEO SOURCE REQUIRED</div>
    <p>TODO: add the approved H.264 file at <code>public/assets/video/screen.mp4</code> (720p or lower, under 15 MB).</p>
  </div>

  const togglePlayback = async () => {
    const player = playerRef.current
    if (!player) return
    if (player.paused) await player.play().catch(() => setPlaying(false))
    else player.pause()
  }
  const unlockSound = () => {
    const player = playerRef.current
    if (!player) return
    setSoundEnabled(true)
    player.muted = false
    player.volume = volume
  }
  const toggleFullscreen = () => { void playerRef.current?.requestFullscreen?.() }

  return <div className="monitor-player">
    <video ref={playerRef} id="portfolio-screen-video" src="/assets/video/screen.mp4" poster="/assets/video/screen-poster.webp"
      playsInline preload="metadata" muted={!soundEnabled} onVolumeChange={event => setVolume(event.currentTarget.volume)} />
    <div className="monitor-player__controls" aria-label="Video playback controls">
      <button type="button" onClick={() => void togglePlayback()} aria-label={playing ? 'Pause video' : 'Play video'}>{playing ? 'Pause' : 'Play'}</button>
      <label className="sr-only" htmlFor="player-seek">Seek</label>
      <input id="player-seek" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)}
        onChange={event => { if (playerRef.current) playerRef.current.currentTime = Number(event.currentTarget.value) }} />
      <button type="button" onClick={soundEnabled ? () => { if (playerRef.current) playerRef.current.muted = true; setSoundEnabled(false) } : unlockSound}>
        {soundEnabled ? 'Mute' : 'Enable sound'}
      </button>
      <label>Volume <input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={event => {
        const next = Number(event.currentTarget.value); setVolume(next)
        if (playerRef.current) { playerRef.current.volume = next; if (next > 0 && soundEnabled) playerRef.current.muted = false }
      }} /></label>
      <button type="button" onClick={toggleFullscreen}>Fullscreen</button>
    </div>
    <span className="monitor-player__time">{formatTime(currentTime)} / {formatTime(duration)}</span>
  </div>
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}
