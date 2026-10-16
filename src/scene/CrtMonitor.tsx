import React from 'react';
import { CrtScreen } from './CrtScreen';

export interface CrtMonitorProps {
  powered?: boolean;
  onTogglePower?: () => void;
}

export const CrtMonitor: React.FC<CrtMonitorProps> = ({
  powered = true,
  onTogglePower,
}) => {
  return <CrtScreen powered={powered} onTogglePower={onTogglePower} />;
};

export default CrtMonitor;
