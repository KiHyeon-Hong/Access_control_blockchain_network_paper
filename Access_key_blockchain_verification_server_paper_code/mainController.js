const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { AccessKeyBlockchain } = require('./AccessKeyBlockchain');
const blockchain = new AccessKeyBlockchain();

/*
 * 출입키 블록체인 네트워크 참여 요청 API
 */
app.post('/reqParticipation', (req, res, next) => {
  const pubIp = blockchain.serverNetworkKeyDecrypt(req.body.pubIp);
  const priIp = blockchain.serverNetworkKeyDecrypt(req.body.priIp);

  if (pubIp === 'Decryption error' || priIp === 'Decryption error') res.json('Decryption error');
  else res.json(blockchain.accessKeyParticipation(pubIp, priIp, req.body.networkKey, req.body.transactionKey));
});

/*
 * 출입키 블록체인 네트워크 상태 정보 반환 API
 */
app.get('/networkState', (req, res, next) => {
  res.json(blockchain.networkState());
});

/*
 * 출입키 블록체인 로그 요청 API
 */
app.get('/blockLog', (req, res, next) => {
  res.json(blockchain.blockLog());
});

/*
 * 서버 네트워크 공개키 반한 API
 */
app.get('/serverNetworkKey', (req, res, next) => {
  const name = 'ServerNetworkKey.pem';

  res.setHeader('Content-Disposition', `attachment; filename=${name}`);
  res.sendFile(blockchain.serverNetworkKey());
});

app.listen(65005, () => {
  blockchain.accessKeyInit();
  console.log(`출입키 블록체인 네트워크가 포트 65005에서 동작 중...`);
});
