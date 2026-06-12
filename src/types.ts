export enum AppState {
  WELCOME = 'WELCOME',
  CONGRATS = 'CONGRATS',
  UNIVERSE = 'UNIVERSE',
  MESSAGE_PANEL = 'MESSAGE_PANEL',
  FINAL_UNLOCK = 'FINAL_UNLOCK'
}

export interface HeartData {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  color: string; // Tailwind glow or hex
  coordinateColor: number; // Hex for Threejs mesh color
  opened: boolean;
}
