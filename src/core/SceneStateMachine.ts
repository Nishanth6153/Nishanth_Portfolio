export type CameraViewMode = 'wide' | 'desk';
export type CameraState = CameraViewMode;

export interface SceneState {
  viewMode: CameraViewMode;
  isTransitioning: boolean;
  reducedMotion: boolean;
  crtPowered: boolean;
}

type Listener = (state: SceneState) => void;

class SceneStateMachineStore {
  private state: SceneState = {
    viewMode: 'wide',
    isTransitioning: false,
    reducedMotion:
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false,
    crtPowered: true,
  };

  private listeners: Set<Listener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = (e: MediaQueryListEvent) => {
        this.setState({ reducedMotion: e.matches });
      };
      mediaQuery.addEventListener?.('change', handleChange);
    }
  }

  public getState(): SceneState {
    return this.state;
  }

  public setState(partial: Partial<SceneState>): void {
    const nextState = { ...this.state, ...partial };
    const changed =
      nextState.viewMode !== this.state.viewMode ||
      nextState.isTransitioning !== this.state.isTransitioning ||
      nextState.reducedMotion !== this.state.reducedMotion ||
      nextState.crtPowered !== this.state.crtPowered;

    if (changed) {
      this.state = nextState;
      this.listeners.forEach((listener) => listener(this.state));
    }
  }

  public setViewMode(mode: CameraViewMode): void {
    if (this.state.viewMode === mode) return;
    this.setState({
      viewMode: mode,
      isTransitioning: !this.state.reducedMotion,
    });
  }

  public toggleViewMode(): void {
    this.setViewMode(this.state.viewMode === 'wide' ? 'desk' : 'wide');
  }

  public completeTransition(): void {
    if (this.state.isTransitioning) {
      this.setState({ isTransitioning: false });
    }
  }

  public toggleCrtPower(): void {
    this.setState({ crtPowered: !this.state.crtPowered });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const sceneStateMachine = new SceneStateMachineStore();
