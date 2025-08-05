// src/plugins/weather.plugin.ts
export function getWeather(location: string): string {
  console.log(`[Plugin] Getting weather for ${location}`);
  if (location.toLowerCase().includes('bangalore')) {
    return JSON.stringify({ location: 'Bangalore', temperature: '24°C', condition: 'Partly cloudy' });
  }
  return JSON.stringify({ location, error: 'Weather data not available for this location.' });
}