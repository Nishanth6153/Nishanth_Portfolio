# Design Decisions

- For the request to make the page literally the same as the current live site, render the live site itself in a fullscreen iframe.
- Keep the outer page free of overlays so it does not alter the reference layout or block its interactions.
- Use an accessible iframe title and allow the referenced experience to use autoplay/fullscreen behavior it requests.
- Preserve the prior standalone scene scaffold as inactive source, without presenting it as the current result.
- Keep the runtime dependency explicit: this exact result requires internet access and can change with the source site.
