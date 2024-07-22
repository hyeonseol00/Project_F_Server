import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const createResponse = (handlerId, responseCode, data = null, userId, dataType = null) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages.response.Response;

  let ResponseData;
  let encodedData = data ? Buffer.from(JSON.stringify(data)) : null;
  if (dataType) {
    ResponseData = protoMessages.responseData[dataType];
    encodedData = ResponseData.encode(data).finish();
  }

  const responsePayload = {
    handlerId,
    responseCode,
    timestamp: Date.now(),
    data: encodedData,
  };

  const buffer = Response.encode(responsePayload).finish();

  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(PACKET_TYPE.NORMAL, 0);

  return Buffer.concat([packetLength, packetType, buffer]);
};
