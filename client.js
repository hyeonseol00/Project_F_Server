import net from 'net';
import Long from 'long';
import { getProtoMessages, loadProtos } from './src/init/loadProtos.js';

const TOTAL_LENGTH = 4; // 전체 길이를 나타내는 4바이트
const PACKET_TYPE_LENGTH = 1; // 패킷타입을 나타내는 1바이트

let userId;
let sequence;
const deviceId = 'test-device';

const createPacket = (handlerId, payload, clientVersion = '1.0.0', type, name) => {
  const protoMessages = getProtoMessages();
  const PayloadType = protoMessages[type][name];

  if (!PayloadType) {
    throw new Error('PayloadType을 찾을 수 없습니다.');
  }

  const payloadMessage = PayloadType.create(payload);
  const payloadBuffer = PayloadType.encode(payloadMessage).finish();

  return {
    handlerId,
    userId,
    clientVersion,
    sequence,
    payload: payloadBuffer,
  };
};

const sendPacket = (socket, packet) => {
  const protoMessages = getProtoMessages();
  const Packet = protoMessages.common.Packet;
  if (!Packet) {
    console.error('Packet 메시지를 찾을 수 없습니다.');
    return;
  }

  const buffer = Packet.encode(packet).finish();
  const packetLength = Buffer.alloc(TOTAL_LENGTH);
  packetLength.writeUInt32BE(buffer.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0);

  const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetType.writeUInt8(1, 0);

  const packetWithLength = Buffer.concat([packetLength, packetType, buffer]);

  socket.write(packetWithLength);
};

const sendPong = (socket, timestamp) => {
  const protoMessages = getProtoMessages();
  const Ping = protoMessages.common.Ping;

  const pongMessage = Ping.create({ timestamp });
  const pongBuffer = Ping.encode(pongMessage).finish();
  const packetLength = Buffer.alloc(TOTAL_LENGTH);
  packetLength.writeUInt32BE(pongBuffer.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0);

  const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetType.writeUInt8(0, 0);

  const packetWithLength = Buffer.concat([packetLength, packetType, pongBuffer]);

  socket.write(packetWithLength);
};

const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

client.connect(PORT, HOST, async () => {
  console.log('서버 연결에 성공했습니다.');
  await loadProtos();

  const successPacket = createPacket(
    0,
    { deviceId, playerId: '', latency: 0 },
    '1.0.0',
    'initial',
    'InitialPacket',
  );

  sendPacket(client, successPacket);
});

client.on('data', (data) => {
  const length = data.readUInt32BE(0);
  const totalHeaderLength = TOTAL_LENGTH + PACKET_TYPE_LENGTH;

  const packetType = data.readUInt8(4);
  const packet = data.slice(totalHeaderLength, totalHeaderLength + length);
  const protoMessages = getProtoMessages();

  if (packetType === 1) {
    const Response = protoMessages.response.Response;

    try {
      const response = Response.decode(packet);
      const responseData = JSON.parse(Buffer.from(response.data).toString());
      if (response.handlerId === 0) userId = responseData.userId;

      console.log('응답 데이터:', responseData);
      sequence = response.sequence;
    } catch (err) {
      console.log(err);
    }
  } else if (packetType === 0) {
    try {
      const Ping = protoMessages.common.Ping;
      const pingMessage = Ping.decode(packet);
      const timestampLong = new Long(
        pingMessage.timestamp.low,
        pingMessage.timestamp.high,
        pingMessage.timestamp.unsigned,
      );
      console.log('서버로부터 ping을 수신했습니다:', timestampLong.toNumber());
      sendPong(client, timestampLong.toNumber());
    } catch (err) {
      console.error('Ping 처리 중 오류 발생:', err);
    }
  }
});

client.on('close', () => {
  console.log('서버와 연결 해제');
});

client.on('error', (err) => {
  console.error('클라이언트 에러:', err);
});

process.on('SIGINT', () => {
  client.end('클라이언트가 종료됩니다.', () => {
    process.exit(0);
  });
});
