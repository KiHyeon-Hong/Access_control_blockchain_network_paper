const request = require('request');
const crypto = require('crypto');
const fs = require('fs');

let sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(time);
    }, time);
  });
};

let blockList = [1, 10, 50];
let transactionList = [1, 10, 100];

for (let i = 1; i < 11; i++) {
  blockList.push(i * 100);
}

for (let i = 1; i < 21; i++) {
  transactionList.push(i * 500);
}

fs.writeFileSync(__dirname + '/files/verification.csv', `NumOfBlock,NumOfTransaction,Time\n`);

let datas = [];

for (let i = 0; i < 10000; i++) {
  datas.push(
    crypto
      .createHash('sha256')
      .update(i + '')
      .digest('hex')
  );
}

async function registrationMain(registCnt, verifiCnt) {
  await clear();

  let requests = [];

  for (let i = 0; i < blockList[registCnt]; i++) {
    requests.push(registration(datas[i]));
  }

  Promise.all(requests).then((result) => {
    verificationMain(registCnt, verifiCnt);
  });
}

async function verificationMain(registCnt, verifiCnt) {
  let start = new Date();
  let requests = [];

  let num = datas[parseInt(blockList[registCnt] / 2)];
  for (let i = 0; i < transactionList[verifiCnt]; i++) {
    requests.push(verification(num));
  }

  Promise.all(requests).then((result) => {
    let time = new Date() - start;

    fs.appendFileSync(__dirname + '/files/verification.csv', `${blockList[registCnt]},${transactionList[verifiCnt]},${time}\n`);
    console.log(`Num of block:  ${blockList[registCnt]}, Num of transaction: ${transactionList[verifiCnt]}, Time: ${time}`);

    if (transactionList.length - 1 !== verifiCnt) verificationMain(registCnt, ++verifiCnt);
    else if (blockList.length - 1 !== registCnt) registrationMain(++registCnt, 0);
  });
}

function registration(data) {
  const registrationRequest = (data) => {
    return new Promise((resolve, reject) => {
      const options = {
        uri: `http://localhost:65006/saveTransaction`,
        method: 'POST',
        form: {
          doorId: data,
          accessKey: data,
        },
      };

      request.post(options, function (error, response, body) {
        resolve(body);
      });
    });
  };

  return registrationRequest(data);
}

function verification(data) {
  const verificationRequest = (data) => {
    return new Promise((resolve, reject) => {
      const options = {
        uri: `http://localhost:65006/reliabilityVerification`,
        method: 'POST',
        form: {
          doorId: data,
          accessKey: data,
        },
      };

      request.post(options, function (error, response, body) {
        resolve(body);
      });
    });
  };

  return verificationRequest(data);
}

function clear() {
  const clearRequest = () => {
    return new Promise((resolve, reject) => {
      request.get('http://localhost:65006/clear', function (error, response, body) {
        resolve(body);
      });
    });
  };

  return clearRequest();
}

registrationMain(0, 0);
