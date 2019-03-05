
import fs from 'fs'
export const fileExists = s => new Promise(r => fs.access(s, fs.F_OK, e => r(!e)))
