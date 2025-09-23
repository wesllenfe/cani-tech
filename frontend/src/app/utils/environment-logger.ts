import { ENVIRONMENT_INFO, getEnvironmentStatus } from '../config/environment.config';


export function logEnvironmentStatus(): void {
  const status = getEnvironmentStatus();
  
  console.log(`
%c🎛️ CANI TECH - AMBIENTE ATIVO
%c${status}
%c
%cPara alterar o ambiente, edite:
%cfrontend/src/app/config/environment.config.ts
%c
%cLinha: export const USE_MOCK_DATA = ${ENVIRONMENT_INFO.mode === 'MOCK' ? 'true' : 'false'};
  `, 
    'font-size: 16px; font-weight: bold; color: #3b82f6;',
    `font-size: 14px; font-weight: bold; color: ${ENVIRONMENT_INFO.color};`,
    'font-size: 12px; color: #6b7280;',
    'font-size: 12px; color: #6b7280;',
    'font-size: 12px; color: #ef4444; font-weight: bold;',
    'font-size: 12px; color: #6b7280;',
    'font-size: 12px; color: #10b981; font-weight: bold;'
  );
}

logEnvironmentStatus();
