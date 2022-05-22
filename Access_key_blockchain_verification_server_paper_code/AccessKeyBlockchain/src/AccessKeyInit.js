const fs = require('fs');
const crypto = require('crypto');

const { AccessKeyLog } = require(__dirname + '/AccessKeyLog.js');
const { AccessKeyIpAddress } = require(__dirname + '/AccessKeyIpAddress.js');

const keyLog = new AccessKeyLog();
const keyIpAddress = new AccessKeyIpAddress();

/*
 * AccessKeyInit
 * 출입키 블록체인 초기설정 모듈
 * @version: 0.0.1
 */
class AccessKeyInit {
  constructor() {
    keyLog.writeAccessKeyLog('Info', 200, '출입키 블록체인 초기설정 모듈 초기화');
  }

  /*
   * getAddress
   * IP 반환 메소드
   * 출입키 블록체인 네트워크에 참여하기 위해, 자신의 공인 IP와 사설 IP를 반환한다.
   * @version: 0.0.1
   * @param: x
   * @return: {publicIp: String, ip: String}: Promise<Json>
   */
  async getAddress() {
    const publicIp = await import('public-ip');
    return JSON.stringify({ publicIp: await publicIp.default.v4(), ip: keyIpAddress.address() });
  }

  /*
   * networkKeyInit
   * 출입키 블록체인 네트워크 키 초기화 메소드
   * 출입키 네트워크 참여를 위한 네트워크 키를 초기화 한다.
   * 이때, 네트워크 키가 이미 존재한다면, 초기화되지 않는다.
   * @version: 0.0.1
   * @param: x
   * @return: true: Boolean
   */
  networkKeyInit() {
    const path = __dirname + '/../keys/NetworkKey';
    const files = fs.readdirSync(path);

    if (files.length !== 3) {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      });

      fs.writeFileSync(__dirname + '/../keys//NetworkKey/NetworkEncryptKey.pem', publicKey);
      fs.writeFileSync(__dirname + '/../keys//NetworkKey/NetworkDecryptKey.pem', privateKey);

      keyLog.writeAccessKeyLog('Info', 200, '네트워크 키 파일 초기화 완료');
    } else {
      keyLog.writeAccessKeyLog('Info', 200, '네트워크 키 파일이 이미 존재함');
    }

    return true;
  }

  /*
   * createFiles
   * 출입키 블록체인 파일 초기화 메소드
   * 출입키 블록체인 검증 모듈의 동작을 위한, 네트워크 파일과 블록체인 파일을 초기화 한다.
   * @version: 0.0.1
   * @param: x
   * @return: true: Boolean
   */
  createFiles() {
    fs.writeFileSync(__dirname + '/../files/Network.json', '[]\n', 'utf8');

    keyLog.writeAccessKeyLog('Info', 200, '출입키 블록체인 검증 모듈 파일 초기화 완료');
    return true;
  }
}

module.exports.AccessKeyInit = AccessKeyInit;
