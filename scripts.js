const puppeteer = require('puppeteer');
const PDFMerge = require('pdf-merge');
const path = require('path');
const fs = require('fs');

let cookie;

/**
 *
 * @returns {Promise<String>}
 */
async function saveSlideAs(url, saveAs) {

  async function toPdf(page, path) {
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

  await changeDom(page);

  let path = saveAs + '.pdf';

  await toPdf(page, path);

  await browser.close();

  return path;
}

module.exports.setCookie = function (val) {
  cookie = val;
};

/**
 * @param urls
 * @returns {Promise<[]>}
 */
function fromUrlsToPdfFiles(urls) {
  const promises = [];
  urls.forEach(async (slideUrl) => {
    try {
      const {resultId, slideId} = parseSlideUrl(slideUrl);
      const saveAs = path.resolve(__dirname, `temp/result-${resultId}_slide-${slideId}`);
      promises.push(saveSlideAs(slideUrl, saveAs));
    } catch (e) {
      console.error('saveSlideAs was finished with error: ' + e.message);
    }
  });
  return Promise.all(promises);
}

/**
 *
 * @param {Array<String>} urls
 * @returns {Promise<*>} Final PDF file buffer
 */
module.exports.createPdfBufferFromUrls = async function (urls) {
  return concatPdfFiles(await fromUrlsToPdfFiles(urls));
};

async function concatPdfFiles(files) {
  return await PDFMerge(files, {output: 'Buffer'});
}

/**
 *
 * @param buffer
 * @param path
 * @returns {Promise<void>}
 */
module.exports.saveBufferedData = async function (buffer, path) {
  fs.writeFile(path, buffer, 'binary', (err) => {
    if (err) throw err;
    return path;
  })
};

/**
 *
 * @param {String} url
 * @returns {{resultId: number, slideId: number}}
 */
function parseSlideUrl(url) {

  const regex = /result\/(\d+).*view\/(\d+)/g;
  let m;
  let res = {
    resultId: 0,
    slideId: 0,
  };

  while ((m = regex.exec(url)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      if (groupIndex === 1) res.resultId = match;
      if (groupIndex === 2) res.slideId = match;
    });
  }

  return res
}
