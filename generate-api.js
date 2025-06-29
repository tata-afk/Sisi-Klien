const fs = require('fs');
const path = require('path');

// Path ke db.json
const dbPath = path.join(__dirname, 'db.json');
// Path ke folder /api
const apiDir = path.join(__dirname, 'api');

// Baca dan parse db.json
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Pastikan folder api/ ada
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir);
}

// Loop setiap key di db.json (misal: dosen, mahasiswa, users, dll)
Object.keys(db).forEach((key) => {
  const filename = path.join(apiDir, `${key}.js`);
  const content = `
    import fs from 'fs';
    import path from 'path';

    const dbPath = path.join(process.cwd(), 'db.json');

    export default function handler(req, res) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

      if (req.method === 'GET') {
        res.status(200).json(data["${key}"]);
      } else {
        res.status(405).json({ message: 'Method Not Allowed' });
      }
    }
  `.trim();

  fs.writeFileSync(filename, content);
  console.log(`✅ Generated: /api/${key}.js`);
});
