export const USE_MOCK_DATA = true;

export const ENVIRONMENT_INFO = {
  mode: USE_MOCK_DATA ? 'MOCK' : 'API',
  description: USE_MOCK_DATA ? 'Dados de desenvolvimento' : 'API real do servidor',
  color: USE_MOCK_DATA ? '#f59e0b' : '#10b981',
  icon: USE_MOCK_DATA ? '🧪' : '🚀'
};

export function isMockMode(): boolean {
  return USE_MOCK_DATA;
}

export function isApiMode(): boolean {
  return !USE_MOCK_DATA;
}

export function getEnvironmentStatus(): string {
  return `${ENVIRONMENT_INFO.icon} ${ENVIRONMENT_INFO.mode} - ${ENVIRONMENT_INFO.description}`;
}
