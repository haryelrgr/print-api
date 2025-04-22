const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3000;

app.get('/print', async (req, res) => {
  const tag = req.query.tag;
  if (!tag) return res.status(400).send('Falta a tag');

  const url = `https://www.clashofstats.com/players/${tag}/army`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(3000);

    const buffer = await page.screenshot({ type: 'png' });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    return res.send(buffer);
  } catch (err) {
    await browser.close();
    console.error('Erro ao capturar:', err);
    return res.status(500).send('Erro ao gerar print');
  }
});

app.listen(PORT, () => console.log(`🚀 API rodando em http://localhost:${PORT}`));