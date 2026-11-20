import fs from 'fs';
import path from 'path';

const src = 'build';
const dest = path.join('.svelte-kit', 'cloudflare');

if (fs.existsSync(src)) {
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
    console.log('[Postbuild] Synced build/ -> .svelte-kit/cloudflare for Cloudflare Pages compatibility.');
}
