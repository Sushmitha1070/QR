import express from 'express';
import qr from 'qr-image';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '')));

// Endpoint to generate QR code for a URL
app.get('/generate-qr', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Generate QR code
    const qr_png = qr.imageSync(url, { type: 'png' });

    // Save URL to file
    fs.appendFileSync(path.join(__dirname, 'urls.txt'), `${url}\n`);

    // Return QR code as base64 encoded PNG
    const qrCodeBase64 = qr_png.toString('base64');
    res.send(qrCodeBase64);
  } catch (err) {
    console.error('Error generating QR code:', err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Endpoint to fetch all stored URLs
app.get('/urls', (req, res) => {
  try {
    const urls = fs.readFileSync(path.join(__dirname, 'urls.txt'), 'utf-8').trim().split('\n');
    res.json({ urls });
  } catch (err) {
    console.error('Error fetching URLs:', err);
    res.status(500).json({ error: 'Failed to fetch URLs' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`QR Code Generator service listening at http://localhost:${port}`);
});
