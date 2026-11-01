const path = require("path");
const puppeteer = require("puppeteer");

// PDF — это печатная версия страницы: без полей ввода, кнопок и формы оплаты
const PRINT_CSS = `
  @page { size: A4; margin: 14mm 0; }
  html, body { background: #000 !important; }
  .fill, .copy, .buy-form, .fine, .more, .pdf { display: none !important; }
  .wrap { max-width: none !important; padding: 0 16mm !important; }
  .hero { padding: 6mm 0 8mm !important; }
  .howto { padding-top: 4mm !important; }
  .group { padding-top: 8mm !important; break-before: auto; }
  .group h2, .group .when { break-after: avoid; }
  .card { break-inside: avoid; }
  .buy, .next { break-inside: avoid; margin-top: 10mm !important; padding-top: 10mm !important; }
  .buy-card::after { content: "Купить: tannyff.github.io/ai-prompts-guide/#buy"; display: block; margin-top: 4mm; color: #c9b0ff; font-weight: 600; }
  footer { padding: 8mm 0 0 !important; }
`;

async function main() {
  const inputPath = path.resolve(__dirname, "..", "index.html");
  const outputPath = path.resolve(__dirname, "..", "20-promptov-dlya-kontenta.pdf");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 });
  await page.goto(`file://${inputPath}`, { waitUntil: "networkidle0" });
  await page.emulateMediaType("screen");
  await page.addStyleTag({ content: PRINT_CSS });
  await page.evaluate(() => document.fonts.ready);

  await page.pdf({
    path: outputPath,
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log("PDF сохранён:", outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
