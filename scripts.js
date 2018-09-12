const puppeteer = require('puppeteer');

/**
 *
 * @param {Object} options
 * @returns {Promise<Array>}
 */
module.exports.saveSlideAs = async function (options) {

  const {url, cookie, saveAs, slideId} = options;

  async function toPng(page) {
    const element = await page.$('.pusher');
    let path = saveAs + '.png';
    files.push(path);
    return element.screenshot({path: path});
  }

  async function toPdf(page) {
    let path = saveAs + '.pdf';
    files.push(path);
    await page.emulateMedia('screen');
    return page.pdf({
      path: path,
      width: '2000px',
      height: '1000px',
      printBackground: true,
      pageRanges: '',
      preferCSSPageSize: true,
      margin: {top: 0, left: 0, right: 0, bottom: 0},
    });
  }

  async function changeDom(page) {
    await page.evaluate(() => {
      const remove = (selector) => {
        let node = document.querySelector(selector);
        node.parentNode.removeChild(node);
      };
      remove('.toggleMenu');
      remove('.slide-number');
    });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.setCookie(cookie);
  console.log(`opening url ${url}...`);
  await page.goto(url, {waitUntil: 'networkidle0'});
  console.log('URL was opened');

  const files = [];

  await changeDom(page);

  await toPng(page);
  await toPdf(page);

  await browser.close();

  return files;
};
