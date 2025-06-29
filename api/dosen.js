import fs from 'fs';
    import path from 'path';

    const dbPath = path.join(process.cwd(), 'db.json');

    export default function handler(req, res) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

      if (req.method === 'GET') {
        res.status(200).json(data["dosen"]);
      } else {
        res.status(405).json({ message: 'Method Not Allowed' });
      }
    }