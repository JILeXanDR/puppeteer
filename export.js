const scripts = require('./scripts');
const path = require('path');
const FakePubSub = require('./pubsub');

scripts.setCookie({
  'name': 'PHPSESSID',
  'value': 'arvucpg223cb2533odsddcvm00', // TODO use  another way to get cookie
  'domain': '.dev4-account2.testapic.com',
  'path': '/',
});

const pubsub = new FakePubSub(); // TODO change with real PubSub client https://github.com/googleapis/nodejs-pubsub

pubsub.subscribe('convert-urls-to-pdf', async function (data) {
  console.log(`Received data ${JSON.stringify(data)} from PubSub`);
  console.log('Starting...');
  const pdfFilePath = path.resolve(__dirname, `temp/result-${data.resultId}.pdf`);
  try {
    const buffer = await scripts.createPdfBufferFromUrls(data.urls);
    await scripts.saveBufferedData(buffer, pdfFilePath);
    console.log('Final PDF file: ' + pdfFilePath);
    // TODO php script will receive this message and sends via WS to the user
    // TODO how to recognize the user?
    pubsub.publish('presentation-final-pdf-file', {resultId: data.resultId, file: pdfFilePath}); // TODO file path or buffer?
  } catch (e) {
    console.error('Error: ' + e.message);
  } finally {
    console.log('Done.');
  }
});
