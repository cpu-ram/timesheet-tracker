import puppeteer, { Browser } from 'puppeteer';

export default async function convertHtmlToPdf(htmlContent: string) {

  let browser: Browser | undefined;

  try {
    browser = await puppeteer.launch({
      headless: 'new' as any,
      args: ['--no-sandbox'],
      timeout: 60000,
      protocolTimeout: 60000,
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
    });

    return pdfBuffer;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
