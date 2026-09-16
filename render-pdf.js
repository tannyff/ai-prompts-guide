// scripts/render-pdf.js
// Рендерит index.html в PDF через headless Chrome (puppeteer),
// сохраняя тёмную тему и вёрстку страницы один в один.

const path = require("path");
const puppeteer = require("puppeteer");

async function main() {
  const inputPath = path.resolve(__dirname, "..", "index.html");
  const outputPath = path.resolve(__dirname, "..", "20-promptov-dlya-kontenta.pdf");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(`file://${inputPath}`, { waitUntil: "networkidle0" });

  // Сохраняем экранные стили (тёмный фон, шрифты) вместо стилей печати
  await page.emulateMediaType("screen");

  // Кнопки "Скопировать" не нужны в статичном PDF
  await page.addStyleTag({
    content: `
      .copy-btn { display: none !important; }
      .prompt-card { padding-right: 24px !important; }
    `,
  });

  await page.pdf({
    path: outputPath,
    printBackground: true,
    format: "A4",
    margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
  });

  await browser.close();
  console.log("PDF сохранён:", outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
