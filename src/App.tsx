/**
 * Show the original interactive experience in its own frame. This keeps the
 * original 3D renderer, licensed scene assets, navigation, monitor content,
 * and interactions intact instead of approximating them with placeholders.
 */
export default function App() {
  return (
    <main className="reference-experience" aria-label="Felix Rieseberg interactive portfolio">
      <iframe
        className="reference-experience__frame"
        title="Felix Rieseberg interactive portfolio"
        src="https://felixrieseberg.com/?room=1"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <noscript>
        <a href="https://felixrieseberg.com/?room=1">Open the interactive portfolio</a>
      </noscript>
    </main>
  )
}
