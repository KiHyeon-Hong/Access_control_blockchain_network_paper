const fs = require('fs');
const crypto = require('crypto');

const { AccessKeyLog } = require(__dirname + '/AccessKeyLog.js');

const keyLog = new AccessKeyLog();

/*
 * AccessKeyParticipation
 * 출입키 블록체인 참여 정보 관리 모듈
 * @version: 0.0.1
 */
class AccessKeyParticipation {
  constructor() {
    keyLog.writeAccessKeyLog('Info', 200, '출입키 블록체인 참여 정보 관리 모듈 초기화');
  }

  /*
   * serverNetworkKeyDecrypt
   * 네트워크 키 복호화 메소드
   * 네트워크 키로 참여를 요청한 노드의 공인 IP와 사설 IP를 복호화한다.
   * @version: 0.0.1
   * @param: ip: String
   * @return: data: String
   */
  serverNetworkKeyDecrypt(data) {
    try {
      const networkDecryptKey = fs.readFileSync(__dirname + '/../keys/NetworkKey/NetworkDecryptKey.pem', 'utf8');

      const decryptedData = crypto.privateDecrypt(
        {
          key: networkDecryptKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(data, 'base64')
      );

      return decryptedData.toString();
    } catch (e) {
      return 'Decryption error';
    }
  }

  checkExistence() {
    let network = JSON.parse(fs.readFileSync(__dirname + '/../files/Network.json', 'utf8'));
  }

  /*
   * accessKeyParticipation
   * 참여 요청 정보 저장 메소드
   * 참여를 요청한 무결성이 보장된 노드의 공인 IP, 사설 IP, 네트워크 키, 그리고 트랜잭션 키를 저장한다.
   * @version: 0.0.1
   * @param: pubIp: String, priIp: String, networkKey: String, transactionKey: String
   * @return: true: Boolean
   */
  accessKeyParticipation(pubIp, priIp, networkKey, transactionKey) {
    const networkJson = { pubIp: pubIp, priIp: priIp, networkKey: networkKey, transactionKey: transactionKey };
    let network = JSON.parse(fs.readFileSync(__dirname + '/../files/Network.json', 'utf8'));

    for (let i = 0; i < network.length; i++) {
      if (network[i].networkKey === networkJson.networkKey || network[i].transactionKey === networkJson.transactionKey) {
        network[i] = networkJson;
        fs.writeFileSync(__dirname + '/../files/Network.json', JSON.stringify(network), 'utf8');

        keyLog.writeAccessKeyLog('Info', 200, `참여 요청 정보 변경 완료(공인 IP: ${pubIp}, 사설 IP: ${priIp})`);
        return true;
      }
    }

    network.push(networkJson);
    fs.writeFileSync(__dirname + '/../files/Network.json', JSON.stringify(network), 'utf8');

    keyLog.writeAccessKeyLog('Info', 200, `참여 요청 정보 저장 완료(공인 IP: ${pubIp}, 사설 IP: ${priIp})`);
    return true;
  }

  /*
   * getParticipant
   * 참여 요청 정보 반환 메소드
   * 참여를 요청한 노드의 환경에서 동작하고 있는 출입키 블록체인 네트워크의 정보를 반환한다.
   * @version: 0.0.1
   * @param: pubIp: String, priIp: String
   * @return: {pubIp: String, priIp: String, networkKey: String, transactionKey: String}: Json
   */
  getParticipant(pubIp, priIp) {
    const network = JSON.parse(fs.readFileSync(__dirname + '/../files/Network.json', 'utf8'));

    keyLog.writeAccessKeyLog('Info', 200, `참여 요청 정보 반환 완료(공인 IP: ${pubIp})`);

    return network.filter((v) => {
      return v.priIp !== priIp;
    });
  }
}

module.exports.AccessKeyParticipation = AccessKeyParticipation;
