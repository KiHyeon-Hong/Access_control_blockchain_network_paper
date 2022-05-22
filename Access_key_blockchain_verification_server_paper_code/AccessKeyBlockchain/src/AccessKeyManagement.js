const fs = require('fs');

const { AccessKeyLog } = require(__dirname + '/AccessKeyLog.js');

const keyLog = new AccessKeyLog();

/*
 * AccessKeyManagement
 * 출입키 블록체인 키 관리 모듈
 * @version: 0.0.1
 */
class AccessKeyManagement {
  constructor() {
    keyLog.writeAccessKeyLog('Info', 200, '출입키 블록체인 키 관리 모듈 초기화');
  }

  /*
   * networkState
   * 출입키 블록체인 네트워크 정보 반환 메소드
   * 현재 서버에서 관리 중인 모든 출입키 블록체인 네트워크의 정보를 반환한다.
   * @version: 0.0.1
   * @param: x
   * @return: {pubIp: String, priIp: String, networkKey: String, transactionKey: String}: Json
   */
  networkState() {
    keyLog.writeAccessKeyLog('Info', 200, '출입키 블록체인 네트워크 정보 반환');
    return JSON.parse(fs.readFileSync(__dirname + '/../files/Network.json', 'utf8'));
  }

  /*
   * serverNetworkKey
   * 서버 네트워크 공개 키 경로 반환 메소드
   * 출입키 블록체인 네트워크에 참여하고 싶은 참여자가 자신의 정보를 암호화하기 위한 네트워크 공개키를 제공받는다.
   * @version: 0.0.1
   * @param: x
   * @return: path: String
   */
  serverNetworkKey() {
    let path = __dirname;
    path = path.split('\\');

    if (path.length == 1) {
      path = path[0].split('/');
    }

    let filePath = '';
    for (let i = 0; i < path.length - 1; i++) {
      filePath = filePath + path[i] + '/';
    }

    return `${filePath}keys/NetworkKey/NetworkEncryptKey.pem`;
  }
}

module.exports.AccessKeyManagement = AccessKeyManagement;
