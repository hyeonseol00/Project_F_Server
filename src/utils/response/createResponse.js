import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const createResponse = (packageType, packetId, data = null) => {
  const protoMessages = getProtoMessages();

  if (!protoMessages[packageType]) {
    console.error(`유효하지 않은 패키지 타입: ${packageType}`);
    throw new Error(`Invalid package type: ${packageType}`);
  }

  const Response = protoMessages[packageType][packetId];

  if (!Response || !Response.encode) {
    console.error(`패킷 ID ${packetId}에 대한 Response가 정의되지 않았습니다.`);
    throw new Error(`Response not defined for packet ID: ${packetId}`);
  }

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
