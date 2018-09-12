const puppeteer = require('puppeteer');

/**
 *
 * @param {String} url
 * @param {Object} cookie
 * @param {String} saveAs
 * @returns {Promise<Array>}
 */
module.exports.saveSlideAs = async function (url, cookie, saveAs) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.setCookie(cookie);
  await page.goto(url);
  await page.waitFor(5000); // FIXME

  // change dom
  await page.evaluate(() => {
    let dom = document.querySelector('.sub.header');
    dom.innerText = 'NEW TEXT!!!!';

    let dom1 = document.querySelector('.toggleMenu');
    dom1.parentNode.removeChild(dom1);

    let dom2 = document.querySelector('.slide-number');
    dom2.parentNode.removeChild(dom2);
  });

  const files = [];

  {
    // to png
    const element = await page.$('.pusher');
    let path = saveAs + '.png';
    files.push(path);
    await element.screenshot({path: path});
  }

  {
    // to pdf
    const dom = await page.$eval('.pusher', (element) => element.innerHTML);
    await page.setContent(dom);
    let path = saveAs + '.pdf';
    files.push(path);
    await page.pdf({path: path});
  }

  await browser.close();

  return files;
};
