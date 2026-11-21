// Lee las variables del archivo .env y genera src/environments/environment.ts
// Angular no lee .env por sí solo, así que este script se ejecuta antes de
// `npm start`, `npm run build` y `npm test` (ver "prestart"/"prebuild" en package.json).
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env');
const outPath = resolve(root, 'src/environments/environment.ts');

// Las variables del sistema tienen prioridad (útil en CI / despliegues)
const fileVars = existsSync(envPath) ? parseEnv(readFileSync(envPath, 'utf8')) : {};
const get = (key, fallback = '') => process.env[key] ?? fileVars[key] ?? fallback;

const apiKey = get('GIPHY_API_KEY');
const apiUrl = get('GIPHY_API_URL', 'https://api.giphy.com/v1');

if (!apiKey || apiKey === 'tu_api_key_aqui') {
  console.warn(
    '\n⚠️  GIPHY_API_KEY no está definida. Copia .env.example a .env y pon tu API key.\n',
  );
}

const content = `// ⚠️ Archivo generado automáticamente por scripts/set-env.mjs desde .env
// No lo edites ni lo subas al repositorio.
export const environment = {
  giphyApiKey: ${JSON.stringify(apiKey)},
  giphyApiUrl: ${JSON.stringify(apiUrl)},
};
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, content);
console.log('✔ src/environments/environment.ts generado desde .env');
