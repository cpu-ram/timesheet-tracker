import puppeteer from 'puppeteer';

export default async function convertHtmlToPdf(htmlContent: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', landscape: true });
  await browser.close();
  return pdfBuffer;
}
