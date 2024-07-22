import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const createResponse = (packageType, packetId, data = null) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages[packageType][packetId];

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
