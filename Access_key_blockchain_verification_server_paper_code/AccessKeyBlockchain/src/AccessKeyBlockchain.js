const { AccessKeyInit } = require(__dirname + '/AccessKeyInit.js');
const { AccessKeyManagement } = require(__dirname + '/AccessKeyManagement.js');
const { AccessKeyParticipation } = require(__dirname + '/AccessKeyParticipation.js');
const { AccessKeyLog } = require(__dirname + '/AccessKeyLog.js');

const keyInit = new AccessKeyInit();
const keyManagement = new AccessKeyManagement();
const participation = new AccessKeyParticipation();
const keyLog = new AccessKeyLog();

/*
 * AccessKeyBlockchain
 * 출입키 블록체인 인터페이스 모듈
 * @version: 0.0.1
 */
class AccessKeyBlockchain {
  constructor() {
    keyLog.writeAccessKeyLog('Info', 200, '출입키 블록체인 인터페이스 모듈 초기화');
  }

  /*
   * accessKeyInit
   * 출입키 블록체인 검증 초기화 메소드
   * 출입키 블록체인 검증 모듈의 초기화를 위해, 네트워크 키, 그리고 파일을 생성 및 초기화한다.
   * @version: 0.0.1
   * @param: x
   * @return: true: Boolean
   */
  accessKeyInit() {
    keyInit.networkKeyInit();
    keyInit.createFiles();

    return true;
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
    return participation.serverNetworkKeyDecrypt(data);
  }

  /*
   * accessKeyParticipation
   * 참여 요청 정보 저장 및 반환 메소드
   * 참여를 요청한 무결성이 보장된 노드의 공인 IP, 사설 IP, 네트워크 키, 그리고 트랜잭션 키를 저장한다.
   * 그 후, 참여를 요청한 노드의 환경에서 동작하고 있는 출입키 블록체인 네트워크의 정보를 반환한다.
   * @version: 0.0.1
   * @param: pubIp: String, priIp: String, networkKey: String, transactionKey: String
   * @return: {pubIp: String, priIp: String, networkKey: String, transactionKey: String}: Json
   */
  accessKeyParticipation(pubIp, priIp, networkKey, transactionKey) {
    participation.accessKeyParticipation(pubIp, priIp, networkKey, transactionKey);
    return participation.getParticipant(pubIp, priIp);
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
    return keyManagement.networkState();
  }

  /*
   * blockLog
   * 출입키 블록체인 로그 반환 메소드
   * 출입키 블록체인 네트워크의 로그를 반환한다.
   * @version: 0.0.1
   * @param: x
   * @return: log: String
   */
  blockLog() {
    return keyLog.readAccessKeyLog();
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
    return keyManagement.serverNetworkKey();
  }
}

module.exports.AccessKeyBlockchain = AccessKeyBlockchain;
