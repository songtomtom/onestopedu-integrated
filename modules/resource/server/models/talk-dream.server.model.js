/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const path = require('path');
const env = require(path.resolve('./config/env/default'));
const autoIncrement = require('mongoose-auto-increment-fix');

/**
 * Initialize auto increment
 */
autoIncrement.initialize(mongoose.connection);

/**
 * Schema
 */
const TalkDreamSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  providers: {
    type: [{
      type: String,
      enum: env.providers
    }],
    trim: true,
    required: 'Please you must select one provider'
  },
  state: {
    type: String,
    enum: ['error', 'kakao', 'sms']
  },
  templateId: {

    /**
     * 10003 회원가입
     * 10004 무료체험-전화수업
     * 10005 무료체험-스카이프
     * 10006 무료체험-화상칠판
     * 10007 무료체험-10분전
     * 10009 수강신청-카드결제
     * 10010 수강신청-무통장입금
     * 10011 수강신청-ARS결제
     * 10012 수강신청-SMS결제
     * 10016 수업 10분전
     * 10024 무료체험-결과
     * 10032 피드백
     * 10036 무료체험-N분전
     */
    enum: [
      10003,
      10004,
      10005,
      10006,
      10007,
      10009,
      10010,
      10011,
      10012,
      10016,
      10024,
      10032,
      10036
    ],
    type: Number
  },
  mobile: {
    type: String,
    trim: true
  },
  message: {
    type: String
  },

  /**
   * Error response
   * ERR_100 authToken 데이터 누락
   * ERR_101 serverName 데이터 누락
   * ERR_102 header 데이터 미일치(인증 실패)
   * ERR_200 body parameter가 null
   * ERR_201 지원하지 않는 parameter를 입력
   * ERR_202 mobile 데이터 누락
   * ERR_203 message 데이터 누락
   * ERR_204 template 데이터 누락
   * ERR_212 부적절한 service 데이터 입력
   * ERR_213 부적절한 template 데이터 입력
   * ERR_214 지원하지 않는 전화번호 format 입력
   * ERR_218 backupProcessCode 데이터 누락
   * ERR_219 부적절한 backupProcessCode 입력
   * ERR_223 템플릿 버튼 5개를 초과하여 발송 요청했을 경우
   * ERR_224 버튼 url 길이 제한을 초과했을 경우
   * ERR_225 메시지 길이 제한을 초과했을 경우
   * ERR_300 CNS 내부 서버 오류
   */
  statusErr: {
    type: String,
    enum: [
      'ERR_100',
      'ERR_101',
      'ERR_102',
      'ERR_200',
      'ERR_201',
      'ERR_202',
      'ERR_203',
      'ERR_204',
      'ERR_212',
      'ERR_213',
      'ERR_214',
      'ERR_218',
      'ERR_219',
      'ERR_223',
      'ERR_224',
      'ERR_225',
      'ERR_300'
    ]
  },

  /**
   * KakaoTalk success response
   * OK       정상코드(SUCCESS)
   * KKO_ERR  LGCNS와 카카오간의 네트워크 에러, 카카오톡 서버 응답 타임아웃
   * KKO_1001 Request Body가 Json형식이 아님
   * KKO_1002 허브 파트너 키가 유효하지 않음
   * KKO_1003 발신 프로피 키가 유효하지 않음
   * KKO_1004 Request Body(Json)에서 name을 찾을 수 없음
   * KKO_1005 발신프로필을 찾을 수 없음
   * KKO_1006 삭제된 발신프로필.
   * KKO_1007 차단 상태의 발신프로필.
   * KKO_1008 차단 상태의 옐로아이디.
   * KKO_1009 닫힘 상태의 옐로아이디.
   * KKO_1010 삭제된 옐로아이디.
   * KKO_1011 계약정보를 찾을 수 없음.
   * KKO_1012 잘못된 형식의 유저키 요청
   * KKO_1030 잘못된 파라메터 요청
   * KKO_2003 메시지 전송 실패
   * KKO_2004 템플릿 일치 확인시 오류 발생
   * KKO_3000 예기치 않은 오류 발생
   * KKO_3005 메시지를 발송했으나 수신확인 안됨(성공불확실)
   *          서버에는 암호화 되어 보관되며 3일 이내 수신 가능
   * KKO_3006 내부 시스템 오류로 메시지 전송 실패
   * KKO_3008 전화번호 오류
   * KKO_3010 Json 파싱 오류
   * KKO_3011 메시지가 존재하지 않음
   * KKO_3012 메시지 일련번호가 중복됨
   *          메시지 일련번호는 CS처리를 위해 메시지 별로 고유한 값이 부여되어야 함"
   * KKO_3013 메시지가 비어 있음
   * KKO_3014 메시지 길이 제한 오류 (템플릿별 제한 길이 또는 1000자 초과)
   * KKO_3015 템플릿을 찾을 수 없음
   * KKO_3016 메시지 내용이 템플릿과 일치하지 않음
   * KKO_3018 메시지를 전송할 수 없음
   * - (공통) 카카오톡을 사용하지 않는 사용자
   * - (알림톡 push방식일 경우) 최근 카카오톡을 사용하지 않은 사용자
   * - (알림톡일 경우) 알림톡 차단을 선택한 사용자
   * KKO_4000 메시지 전송 결과를 찾을 수 없음
   * KKO_4001 알 수 없는 메시지 상태
   * KKO_9998 담당자가 시스템에 문제가 있어 확인하고 있는 경우
   * KKO_9999 담당자가 시스템에 문제가 있어 확인하고 있는 경우
   */
  statusKakao: {
    type: String,
    enum: [
      'OK',
      'KKO_ERR',
      'KKO_1001',
      'KKO_1002',
      'KKO_1003',
      'KKO_1004',
      'KKO_1005',
      'KKO_1006',
      'KKO_1007',
      'KKO_1008',
      'KKO_1009',
      'KKO_1010',
      'KKO_1011',
      'KKO_1012',
      'KKO_1030',
      'KKO_2003',
      'KKO_2004',
      'KKO_3000',
      'KKO_3005',
      'KKO_3006',
      'KKO_3008',
      'KKO_3010',
      'KKO_3011',
      'KKO_3012',
      'KKO_3013',
      'KKO_3014',
      'KKO_3015',
      'KKO_3016',
      'KKO_3018',
      'KKO_4000',
      'KKO_4001',
      'KKO_9998',
      'KKO_9999'
    ]
  },

  /**
   * SMS or MMS success response
   * OK       정상코드(SUCCESS)
   * VE10     휴대폰 번호 검증 오류
   * VE20     메시지 data 검증 오류
   * VE30     device_id 검증 오류
   * VE40     검증오류(알수없는 오류)
   * VE50     회신번호 white list에 없음
   * VE51     회신번호 세칙에 의해 발송 할수 없는 번호
   * VE60     암복호화 오류
   * VE70     발송제한으로 메시지  발송불가 (선불 충전고개의 잔액부족 또는 서비스발송제한 적용 시)
   * SMS_00   발송 진행 중(발송 결과는 별도 요청으로 확인 필요(SMS&LMS 결과 요청))
   * SMS_01   E_SYSFAIL
   * SMS_02   E_AUTH_FAIL
   * SMS_03   BIND 안됨
   * SMS_05   착신자 없음
   * SMS_06   전송 성공
   * SMS_07   비가입자(결번)
   * SMS_08   단말기 전원 꺼짐
   * SMS_09   음영지역
   * SMS_10   단말기 메시지 꽉참
   * SMS_11   단말기 전원 꺼짐, 음영지역, 이통사 TIME OUT
   * SMS_13   번호 이동
   * SMS_14   무선망에러
   * SMS_17   Callback 사용자 아님
   * SMS_18   메시지 중복 발송
   * SMS_19   월 송신 건수 초과
   * SMS_20   기타 에러
   * SMS_21   착신번호 에러(자리수)
   * SMS_22   착신번호 에러(없는국번)
   * SMS_23   수신거부 메시지 없음
   * SMS_24   21시 이후 광고
   * SMS_25   광고(성인, 대출등)
   * SMS_26   데이콤 스팸 필터링
   * SMS_27   야간 발송 차단
   * SMS_28   사전 미등록 발신번호 사용
   * SMS_29   전화번호 세칙 미준수 발신 번호 사용
   * SMS_30   발신번호 변작으로 등록된 발신번호 사용
   * SMS_31   번호 도용 문자 차단 서비스에 가입된 발신번호 사용
   * SMS_40   단말기 착신 거부(스팸등)
   * SMS_70   기타오류
   * SMS_80   결번(SKT)
   * SMS_81   전송실패(SKT)
   * SMS_82   번호이동 DB 조회 불가(SKT)
   * SMS_83   번호이동번호
   * SMS_84   시간 초과(SKT)
   * SMS_85   전송 실패(SKT)
   * SMS_91   발송 미허용 시간 발송 실패 처리
   * SMS_99   중복 발송(환경설정 파일)
   * MMS_0000 발송 진행 중(발송 결과는 별도 요청으로 확인 필요(SMS&LMS 결과 요청))
   * MMS_2000 포멧 에러
   * MMS_2001 잘못된 번호
   * MMS_2002 컨텐츠 사이즈 및개수 초과
   * MMS_2003 잘못된 컨텐츠
   * MMS_3000 가업형 MMS 미지원 단말기
   * MMS_3001 메시지 저장 개수 초과
   * MMS_3002 단말기 전원 꺼짐, 음영지역, 이통사 TIME OUT
   * MMS_3004 전원 꺼짐
   * MMS_3005 음영지역
   * MMS_3006 기타
   * MMS_4000 서버문제로 인한 접수 실패
   * MMS_4001단말기 일시 서비스 정지
   * MMS_4002 통신사 내부 실패(무선망)
   * MMS_4003 서비스 일시적 에러
   * MMS_4101 계정 차단
   * MMS_4102 허용되지 않은 IP 접근
   * MMS_4104 건수 부족
   * MMS_4201 국제 MMS 발송 권한 없음
   * MMS_5000 번호 이동 에러
   * MMS_5001 선불 발급 발송 건수 초과
   * MMS_5003 스팸 처리
   * MMS_5201 중복된 키 접수 차단
   * MMS_5202 중복된 수신번호 접수 차단
   * MMS_5301 사전 미등록 발신번호 사용
   * MMS_5302 전화번호 세칙 미준수 발신 번호 사용
   * MMS_5303 발신번호 변작으로 등록된 발신번호 사용
   * MMS_5304 번호 도용 문자 차단 서비스에 가입된 발신번호 사용
   * MMS_9001 발송 미허용 시간 발송 실패 처리
   * MMS_9002 폰 번호 에러
   * MMS_9003 스팸 번호(스팸 사용시)
   * MMS_9004 이통사 응답 없음
   * MMS_9005 파일 크기 오류
   * MMS_9006 지원되지 않는 파일
   * MMS_9007 파일 오류
   * MMS_9008 메시지 TYPE 오류
   * MMS_9009 중복 발송(환경설정 파일)
   * MMS_9010 재전송 횟수 초과로 인한 실패
   * MMS_9011 발송 지연 실패
   */
  statusSMS: {
    type: String,
    enum: [
      'OK',
      'VE10',
      'VE20',
      'VE30',
      'VE40',
      'VE50',
      'VE51',
      'VE60',
      'VE70',
      'SMS_00',
      'SMS_01',
      'SMS_02',
      'SMS_03',
      'SMS_05',
      'SMS_06',
      'SMS_07',
      'SMS_08',
      'SMS_09',
      'SMS_10',
      'SMS_11',
      'SMS_13',
      'SMS_14',
      'SMS_17',
      'SMS_18',
      'SMS_19',
      'SMS_20',
      'SMS_21',
      'SMS_22',
      'SMS_23',
      'SMS_24',
      'SMS_25',
      'SMS_26',
      'SMS_27',
      'SMS_28',
      'SMS_29',
      'SMS_30',
      'SMS_31',
      'SMS_40',
      'SMS_70',
      'SMS_80',
      'SMS_81',
      'SMS_82',
      'SMS_83',
      'SMS_84',
      'SMS_85',
      'SMS_91',
      'SMS_99',
      'MMS_0000',
      'MMS_2000',
      'MMS_2001',
      'MMS_2002',
      'MMS_2003',
      'MMS_3000',
      'MMS_3001',
      'MMS_3002',
      'MMS_3004',
      'MMS_3005',
      'MMS_3006',
      'MMS_4000',
      'MMS_4001',
      'MMS_4002',
      'MMS_4003',
      'MMS_4101',
      'MMS_4102',
      'MMS_4104',
      'MMS_4201',
      'MMS_5000',
      'MMS_5001',
      'MMS_5003',
      'MMS_5201',
      'MMS_5202',
      'MMS_5301',
      'MMS_5302',
      'MMS_5303',
      'MMS_5304',
      'MMS_9001',
      'MMS_9002',
      'MMS_9003',
      'MMS_9004',
      'MMS_9005',
      'MMS_9006',
      'MMS_9007',
      'MMS_9008',
      'MMS_9009',
      'MMS_9010',
      'MMS_9011'
    ]
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Hook a pre save method to push state
 */
TalkDreamSchema.pre('save', function(next) {
  if (this.statusErr && this.isModified('statusErr')) {
    this.state = 'error';
  }
  next();
});

/**
 * Hook a pre save method to push state
 */
TalkDreamSchema.pre('save', function(next) {
  if (this.statusKakao === 'OK' && this.statusKakao && this.isModified('statusKakao')) {
    this.state = 'kakao';
  }
  next();
});

/**
 * Hook a pre save method to push state
 */
TalkDreamSchema.pre('save', function(next) {
  if (this.statusSMS && this.isModified('statusSMS')) {
    this.state = 'sms';
  }
  next();
});

/**
 * Set virtual field display error status
 */
TalkDreamSchema.virtual('statusErrMessage').get(function() {

  const message = {
    ERR_100: 'authToken 데이터 누락',
    ERR_101: 'serverName 데이터 누락',
    ERR_102: 'header 데이터 미일치(인증 실패)',
    ERR_200: 'body parameter가 null',
    ERR_201: '지원하지 않는 parameter를 입력',
    ERR_202: 'mobile 데이터 누락',
    ERR_203: 'message 데이터 누락',
    ERR_204: 'template 데이터 누락',
    ERR_212: '부적절한 service 데이터 입력',
    ERR_213: '부적절한 template 데이터 입력',
    ERR_214: '지원하지 않는 전화번호 format 입력',
    ERR_218: 'backupProcessCode 데이터 누락',
    ERR_219: '부적절한 backupProcessCode 입력',
    ERR_223: '템플릿 버튼 5 개를 초과하여 발송 요청했을 경우',
    ERR_224: '버튼 url 길이 제한을 초과했을 경우',
    ERR_225: '메시지 길이 제한을 초과했을 경우',
    ERR_300: 'CNS 내부 서버 오류'
  };

  return message[this.statusErr];
});

/**
 * Set virtual field display kakao status
 */
TalkDreamSchema.virtual('statusKakaoMessage').get(function() {
  const message = {
    OK: '정상코드(SUCCESS)',
    KKO_ERR: 'LGCNS와 카카오간의 네트워크 에러, 카카오톡 서버 응답 타임아웃',
    KKO_1001: 'Request Body가 Json형식이 아님',
    KKO_1002: '허브 파트너 키가 유효하지 않음',
    KKO_1003: '발신 프로피 키가 유효하지 않음',
    KKO_1004: 'Request Body(Json)에서 name을 찾을 수 없음',
    KKO_1005: '발신프로필을 찾을 수 없음',
    KKO_1006: '삭제된 발신프로필.',
    KKO_1007: '차단 상태의 발신프로필.',
    KKO_1008: '차단 상태의 옐로아이디.',
    KKO_1009: '닫힘 상태의 옐로아이디.',
    KKO_1010: '삭제된 옐로아이디.',
    KKO_1011: '계약정보를 찾을 수 없음.',
    KKO_1012: '잘못된 형식의 유저키 요청',
    KKO_1030: '잘못된 파라메터 요청',
    KKO_2003: '메시지 전송 실패',
    KKO_2004: '템플릿 일치 확인시 오류 발생',
    KKO_3000: '예기치 않은 오류 발생',
    KKO_3005: `메시지를 발송했으나 수신확인 안됨(성공불확실),
              -서버에는 암호화 되어 보관되며 3일 이내 수신 가능`,
    KKO_3006: '내부 시스템 오류로 메시지 전송 실패',
    KKO_3008: '전화번호 오류',
    KKO_3010: 'Json 파싱 오류',
    KKO_3011: '메시지가 존재하지 않음',
    KKO_3012: `메시지 일련번호가 중복됨
              -메시지 일련번호는 CS처리를 위해 메시지 별로 고유한 값이 부여되어야 함`,
    KKO_3013: '메시지가 비어 있음',
    KKO_3014: '메시지 길이 제한 오류 (템플릿별 제한 길이 또는 1000자 초과)',
    KKO_3015: '템플릿을 찾을 수 없음',
    KKO_3016: '메시지 내용이 템플릿과 일치하지 않음',
    KKO_3018: `메시지를 전송할 수 없음
               -(공통) 카카오톡을 사용하지 않는 사용자,
               -(알림톡 push방식일 경우) 최근 카카오톡을 사용하지 않은 사용자,
               -(알림톡일 경우) 알림톡 차단을 선택한 사용자`,
    KKO_4000: '메시지 전송 결과를 찾을 수 없음',
    KKO_4001: '알 수 없는 메시지 상태',
    KKO_9998: '담당자가 시스템에 문제가 있어 확인하고 있는 경우',
    KKO_9999: '담당자가 시스템에 문제가 있어 확인하고 있는 경우'
  };

  return message[this.statusKakao];
});

/**
 * Set virtual field display SMS status
 */
TalkDreamSchema.virtual('statusSMSMessage').get(function() {
  const message = {
    OK: '정상코드(SUCCESS)',
    VE10: '휴대폰 번호 검증 오류',
    VE20: '메시지 data 검증 오류',
    VE30: 'device_id 검증 오류',
    VE40: '검증오류(알수없는 오류)',
    VE50: '회신번호 white list에 없음',
    VE51: '회신번호 세칙에 의해 발송 할수 없는 번호',
    VE60: '암복호화 오류',
    VE70: '발송제한으로 메시지  발송불가 (선불 충전고개의 잔액부족 또는 서비스발송제한 적용 시)',
    SMS_00: '발송 진행 중(발송 결과는 별도 요청으로 확인 필요(SMS&LMS 결과 요청))',
    SMS_01: 'E_SYSFAIL',
    SMS_02: 'E_AUTH_FAIL',
    SMS_03: 'BIND 안됨',
    SMS_05: '착신자 없음',
    SMS_06: '전송 성공',
    SMS_07: '비가입자(결번)',
    SMS_08: '단말기 전원 꺼짐',
    SMS_09: '음영지역',
    SMS_10: '단말기 메시지 꽉참',
    SMS_11: '단말기 전원 꺼짐, 음영지역, 이통사 TIME OUT',
    SMS_13: '번호 이동',
    SMS_14: '무선망에러',
    SMS_17: 'Callback 사용자 아님',
    SMS_18: '메시지 중복 발송',
    SMS_19: '월 송신 건수 초과',
    SMS_20: '기타 에러',
    SMS_21: '착신번호 에러(자리수)',
    SMS_22: '착신번호 에러(없는국번)',
    SMS_23: '수신거부 메시지 없음',
    SMS_24: '21시 이후 광고',
    SMS_25: '광고(성인, 대출등)',
    SMS_26: '데이콤 스팸 필터링',
    SMS_27: '야간 발송 차단',
    SMS_28: '사전 미등록 발신번호 사용',
    SMS_29: '전화번호 세칙 미준수 발신 번호 사용',
    SMS_30: '발신번호 변작으로 등록된 발신번호 사용',
    SMS_31: '번호 도용 문자 차단 서비스에 가입된 발신번호 사용',
    SMS_40: '단말기 착신 거부(스팸등)',
    SMS_70: '기타오류',
    SMS_80: '결번(SKT)',
    SMS_81: '전송실패(SKT)',
    SMS_82: '번호이동 DB 조회 불가(SKT)',
    SMS_83: '번호이동번호',
    SMS_84: '시간 초과(SKT)',
    SMS_85: '전송 실패(SKT)',
    SMS_91: '발송 미허용 시간 발송 실패 처리',
    SMS_99: '중복 발송(환경설정 파일)',
    MMS_0000: '발송 진행 중(발송 결과는 별도 요청으로 확인 필요(SMS&LMS 결과 요청))',
    MMS_2000: '포멧 에러',
    MMS_2001: '잘못된 번호',
    MMS_2002: '컨텐츠 사이즈 및개수 초과',
    MMS_2003: '잘못된 컨텐츠',
    MMS_3000: '가업형 MMS 미지원 단말기',
    MMS_3001: '메시지 저장 개수 초과',
    MMS_3002: '단말기 전원 꺼짐, 음영지역, 이통사 TIME OUT',
    MMS_3004: '전원 꺼짐',
    MMS_3005: '음영지역',
    MMS_3006: '기타',
    MMS_4000: '서버문제로 인한 접수 실패',
    MMS_4001: '단말기 일시 서비스 정지',
    MMS_4002: '통신사 내부 실패(무선망)',
    MMS_4003: '서비스 일시적 에러',
    MMS_4101: '계정 차단',
    MMS_4102: '허용되지 않은 IP 접근',
    MMS_4104: '건수 부족',
    MMS_4201: '국제 MMS 발송 권한 없음',
    MMS_5000: '번호 이동 에러',
    MMS_5001: '선불 발급 발송 건수 초과',
    MMS_5003: '스팸 처리',
    MMS_5201: '중복된 키 접수 차단',
    MMS_5202: '중복된 수신번호 접수 차단',
    MMS_5301: '사전 미등록 발신번호 사용',
    MMS_5302: '전화번호 세칙 미준수 발신 번호 사용',
    MMS_5303: '발신번호 변작으로 등록된 발신번호 사용',
    MMS_5304: '번호 도용 문자 차단 서비스에 가입된 발신번호 사용',
    MMS_9001: '발송 미허용 시간 발송 실패 처리',
    MMS_9002: '폰 번호 에러',
    MMS_9003: '스팸 번호(스팸 사용시)',
    MMS_9004: '이통사 응답 없음',
    MMS_9005: '파일 크기 오류',
    MMS_9006: '지원되지 않는 파일',
    MMS_9007: '파일 오류',
    MMS_9008: '메시지 TYPE 오류',
    MMS_9009: '중복 발송(환경설정 파일)',
    MMS_9010: '재전송 횟수 초과로 인한 실패',
    MMS_9011: '발송 지연 실패'
  };

  return message[this.statusSMS];
});

/**
 * Virtual setting to josn parsing
 */
TalkDreamSchema.set('toJSON', {
  virtuals: true
});

/**
 * Plug in auto increment
 */
TalkDreamSchema.plugin(autoIncrement.plugin, {
  model: 'TalkDream',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('TalkDream', TalkDreamSchema, 'resources.talkdreams');
