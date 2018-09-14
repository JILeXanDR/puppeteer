module.exports = function () {
  let callback;
  this.subscribe = function (event, fn) {
    callback = fn;
    // emulate sending data to the pubsub
    this.fakeSend('convert-urls-to-pdf', {
      resultId: 94,
      urls: [
        'https://dev4-account2.testapic.com/customer/result/94/slide/view/19794',
        'https://dev4-account2.testapic.com/customer/result/94/slide/view/19795',
        // 'https://dev4-account2.testapic.com/customer/result/94/slide/view/19796',
        // 'https://dev4-account2.testapic.com/customer/result/94/slide/view/19797',
        // 'https://dev4-account2.testapic.com/customer/result/94/slide/view/19798',
      ],
    });
  };
  this.fakeSend = function (event, data) {
    callback(data);
  };
  this.publish = function (event, data) {

  };
};
