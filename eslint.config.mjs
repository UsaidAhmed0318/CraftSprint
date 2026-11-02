import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    // Tool previews show blob:/data: images made in the browser; next/image cannot optimise those.
    files: ['components/tools/**/*.tsx'],
    rules: { '@next/next/no-img-element': 'off' },
  },
  globalIgnores(['.next/**', 'node_modules/**']),
]);
