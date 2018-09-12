const path = require('path');
const scripts = require('./scripts');

const cookie = {
  'name': 'PHPSESSID',
  'value': 'arvucpg223cb2533odsddcvm00',
  'domain': '.dev4-account2.testapic.com',
  'path': '/',
};

const slideId = 19819;

(async function () {
  try {
    console.log('Starting...');
    const files = await scripts.saveSlideAs({
      url: `https://dev4-account2.testapic.com/customer/result/94/slide/view/${slideId}`,
      cookie: cookie,
      saveAs: path.resolve(__dirname, `res/slide-${slideId}`),
      slideId: slideId,
    });
    console.log('Generated files are: ' + JSON.stringify(files));
    console.log('Done.');
  } catch (e) {
    console.error('saveSlideAs was finished with error: ' + e.message);
  } finally {
    process.exit(0);
  }
})();
