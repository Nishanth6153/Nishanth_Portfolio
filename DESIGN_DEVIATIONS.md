# Design Deviations and Runtime Dependency

The requested exact current experience is delivered as a fullscreen live embed of `https://felixrieseberg.com/?room=1`. The original site supplies the 3D room, authored assets, content, and interactions. This is visually and behaviorally exact while that source is available, but it is not a standalone local reconstruction.

The earlier model-first React Three Fiber scaffold remains in `src/scene/` but is not mounted. An offline clone or independently hosted copy would require permission and access to the complete scene package and licensed source assets. The embed depends on internet connectivity, the source website's availability and framing policy, and its future revisions.
