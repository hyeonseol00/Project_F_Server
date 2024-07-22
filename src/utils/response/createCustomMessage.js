import { getProtoMessages } from '../../init/loadProtos.js';

export const createCustomMessage = (packageType, packetId, data = null) => {
  const protoMessages = getProtoMessages();
  const Response = protoMessages[packageType][packetId];

  const buffer = Response.encode(data).finish();

  return buffer;
};
