import puppeteer from 'puppeteer';

export default async function convertHtmlToPdf(htmlContent) {

  // const verifiedHtmlContent = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head>Lorem ipsum<body></body></html>";

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdfBuffer;
}
