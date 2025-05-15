import fs from 'fs';
import path from 'path';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const guidesPath = path.resolve('static/guides');
  const files = fs.readdirSync(guidesPath);
  const htmlFiles = files.filter(file => file.endsWith('.html'));

  const guides = htmlFiles.map(file => ({
    name: file.replace(/_/g, ' ').replace(/\.html$/, ''),
    path: `/guides/${file}`
  }));

  return {
    guides
  };
};