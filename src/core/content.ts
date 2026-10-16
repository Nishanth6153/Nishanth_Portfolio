export interface CrtDisplayContent {
  systemHeader: string;
  biosVersion: string;
  memoryCheck: string;
  osBanner: string;
  statusLines: string[];
  promptHint: string;
}

export const PORTFOLIO_CONTENT: CrtDisplayContent = {
  systemHeader: 'AWARD MODULAR BIOS v4.51PG, An Energy Star Ally',
  biosVersion: 'Copyright (C) 1998, Workstation Systems Corp.',
  memoryCheck: '65536K OK  |  VRAM 16MB SGRAM',
  osBanner: 'WORKSTATION OS // LATE-1990s ENVIRONMENT',
  statusLines: [
    'MOUNT /DEV/HDA1 .................... [OK]',
    'INIT DISPLAY: 17" CRT TRINITRON .... [OK]',
    'PORTFOLIO MODULES .................. [STANDBY]',
    'SELECT DESK VIEW OR PRESS [ENTER] TO FOCUS',
  ],
  promptHint: 'C:\\PORTFOLIO> _',
};

export interface OnlineProfile {
  label: string;
  url: string;
  display: string;
}

export interface ContentModel {
  identity: {
    name: string;
    tagline: string;
    shortBio: string;
  };
  about: string[];
  profiles: OnlineProfile[];
  credits: string;
}

export const CONTENT: ContentModel = {
  identity: {
    name: 'Late-1990s Workstation Portfolio',
    tagline: 'Retro Computing & 3D Interactive Environment',
    shortBio: 'A cinematic 3D room study recreating a late-1990s workstation experience.',
  },
  about: [
    'An interactive 3D portfolio study built with Three.js, React Three Fiber, and TypeScript.',
  ],
  profiles: [
    { label: 'GitHub', url: 'https://github.com', display: 'github.com' },
  ],
  credits: 'Designed with procedural textures and authentic period references.',
};
