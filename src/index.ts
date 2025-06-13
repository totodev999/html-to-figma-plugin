import { chromium } from '@playwright/test';
import { htmlToFigma, setContext } from './browser';

const render = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>カードレイアウトのサンプル</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
<div id="container">
  <div class="card-container">
    <div class="card">
      <img src="https://placehold.jp/150x100.png" alt="サンプル画像" class="card-img">
      <div class="card-body">
        <h2 class="card-title">タイトル1</h2>
        <p class="card-description">これはサンプルの説明文です。ちょっと複雑なレイアウトになっています。</p>
        <a href="#" class="card-button">詳細を見る</a>
      </div>
    </div>
    <div class="card">
      <img src="https://placehold.jp/150x100.png" alt="サンプル画像" class="card-img">
      <div class="card-body">
        <h2 class="card-title">タイトル2</h2>
        <p class="card-description">別のカードの説明文です。説明が複数行になることもあります。</p>
        <a href="#" class="card-button">詳細を見る</a>
      </div>
    </div>
    <!-- さらにカードを追加したい場合は、.card をコピーして増やせます -->
  </div>
  </div>	
</body>
</html>`);

  const context = await page.evaluate(() => ({
    document: window.document,
    window: window,
  }));

  console.log(context);

  setContext(context.window);
  const res = await htmlToFigma('#container');

  console.log("const res = await htmlToFigma('#container');", res);
};
