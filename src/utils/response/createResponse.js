import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const createResponse = (packageType, packetId, data = null) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages[packageType][packetId];

  // 디버깅 로그 추가
  // console.log('Creating response with data:', data);

  const buffer = Response.encode(data).finish();

  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(PACKET_TYPE[packetId], 0);

  return Buffer.concat([packetLength, packetType, buffer]);
};

export const createResponseAsync = async (packageType, packetId, data = null) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages[packageType][packetId];

  // 디버깅 로그 추가
  // console.log('Creating response with data:', data);

  const buffer = await Response.encode(data).finish();

  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(PACKET_TYPE[packetId], 0);

  return Buffer.concat([packetLength, packetType, buffer]);
};
