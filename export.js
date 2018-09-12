const path = require('path');
const scripts = require('./scripts');

const cookie = {
  'name': 'PHPSESSID',
  'value': 'arvucpg223cb2533odsddcvm00',
  'domain': '.dev4-account2.testapic.com',
  'path': '/',
};

const saveAs = path.resolve(__dirname, `res/slide-19794`);

(async function () {
  console.log('Started...');
  const files = await scripts.saveSlideAs('https://dev4-account2.testapic.com/customer/result/94/slide/view/19794', cookie, saveAs);
  console.log('Generated files are: ' + JSON.stringify(files));
  console.log('Done.');
})();
