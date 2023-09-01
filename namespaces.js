import { fileURLToPath } from 'url';
import { dirname, resolve, sep } from 'path';



export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const dirnameChangeSeparator = (separator="/", path=__dirname) => resolve(path).split(sep).join(separator);
