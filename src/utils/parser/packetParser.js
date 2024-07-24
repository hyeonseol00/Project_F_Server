import { config } from '../../config/config.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (data, packetId) => {
  const protoMessages = getProtoMessages();
  const protoTypeName = getProtoTypeNameByHandlerId(packetId);
  if (!protoTypeName)
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 패킷 ID: ${packetId}`);

  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namespace][typeName];
  let payload;
  try {
    payload = PayloadType.decode(data);
  } catch (err) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
  }

  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  for (let i = 0; i < missingFields.length; i++) {
    payload[missingFields[i]] = null;
  }

  return { payload };
};
