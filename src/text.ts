import fs from 'fs';
import path from 'path';
export const text = (name: string): string => {
    return fs.readFileSync(path.join(__dirname, 'txt', name), 'utf-8');
}