const BASE_URL = 'http://localhost:5000';

// Generic GET request
export async function apiGet(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`GET ${endpoint} failed: ${response.status}`);
  }
  return response.json();
}

// Generic POST request
export async function apiPost(endpoint, data) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`POST ${endpoint} failed: ${response.status}`);
  }
  return response.json();
}


export function getEnvOptions() {
  return apiGet('/api/envs');
}

export function getDatabaseOptions() {
  return apiGet('/api/databases');
}

export function getModuleOptions() {
  return apiGet('/api/modules');
}

export function getDatasourcesOptions() {
  return apiGet('/api/datasources');
}

export function getAllConfigurations() {
  return apiGet('/configs');
}

export function saveConfiguration(config) {
  return apiPost('/config', config);
}

/**
 * Fetch statistics data for a dashboard widget
 * @param {string} configId - Configuration ID
 * @returns {Promise<Object>} - Statistics data
 */
export function getStats(configId) {
    return apiGet(`/stats?config=${encodeURIComponent(configId)}`);
  }
  
  /**
   * Fetch drilldown data for a specific environment and month
   * @param {string} configId - Configuration ID
   * @param {string} env - Environment name
   * @param {string} month - Month in format 'MonthName/Year'
   * @returns {Promise<Object>} - Drilldown data
   */
  export function getDrilldown(configId, env, month) {
    return apiGet(`/drilldown?env=${encodeURIComponent(env)}&month=${encodeURIComponent(month)}&config=${encodeURIComponent(configId)}`);
  }