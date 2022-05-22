const request = require('request');
const crypto = require('crypto');
const fs = require('fs');

let transactionList = [1, 10, 50, 100];

for (let i = 1; i < 21; i++) {
  transactionList.push(i * 500);
}

let datas = [];

for (let i = 0; i < 10000; i++) {
  datas.push(
    crypto
      .createHash('sha256')
      .update(i + '')
      .digest('hex')
  );
}

fs.writeFileSync(__dirname + '/files/registration.csv', `NumOfTransaction,Time\n`);

async function main(cnt) {
  await clear();

  let start = new Date();
  let requests = [];

  for (let i = 0; i < transactionList[cnt]; i++) {
    requests.push(registration(datas[i]));
  }

  Promise.all(requests).then((result) => {
    let time = new Date() - start;

    fs.appendFileSync(__dirname + '/files/registration.csv', `${transactionList[cnt]},${time}\n`);
    console.log(`Num of transaction: ${transactionList[cnt]}, Time: ${time}\n`);

    if (transactionList.length - 1 !== cnt) main(++cnt);
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

main(0);
