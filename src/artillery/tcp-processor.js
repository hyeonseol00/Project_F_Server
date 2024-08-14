const net = require('net');
const protobuf = require('protobufjs');

// Protobuf 메시지 로드
const rootResponse = protobuf.loadSync('../artillery_proto/src/protobuf/response/response.proto');
const rootTown = protobuf.loadSync('../artillery_proto/src/protobuf/request/town.packet.proto');
const C_Register = rootTown.lookupType('C_Register');
const S_Register = rootResponse.lookupType('S_Register');
const C_LogIn = rootTown.lookupType('C_LogIn');
const S_LogIn = rootResponse.lookupType('S_LogIn');
const C_Enter = rootTown.lookupType('C_Enter');
const S_Enter = rootResponse.lookupType('S_Enter');

let acc = 10000;
const nickname = `${Date.now()}`;
const password = 'password123';

module.exports = {
  connect: function (context, events, done) {
    context.client = new net.Socket();
    context.client.connect(27015, 'hyeonseol.iptime.org', () => {
      events.emit('log', 'Connected to server');
      done();
    });

    context.client.on('error', (err) => {
      events.emit('log', `Connection error: ${err.message}`);
      done(err);
    });
  },
  sendRegisterRequest: function (context, events, done) {
    const payload = {
      nickname: `${++acc}`,
      password,
    };

    const message = C_Register.create(payload);
    const buffer = C_Register.encode(message).finish();

    const packetLength = Buffer.alloc(4);
    packetLength.writeUInt32LE(buffer.length + 4 + 1, 0);

    const packetType = Buffer.alloc(1);
    packetType.writeUInt8(201, 0);

    context.client.write(Buffer.concat([packetLength, packetType, buffer]), () => {
      events.emit('log', 'Regist request sent');
      done();
    });
  },
  receiveRegisterResponse: function (context, events, done) {
    context.client.once('data', (data) => {
      const packet = data.slice(5);
      const response = S_Register.decode(packet);
      if (response.success) {
        events.emit('log', 'Regist successful!');
      } else {
        events.emit('log', `Regist failed: ${response.message}`);
      }
      done();
    });
  },
  sendLoginRequest: function (context, events, done) {
    const payload = {
      nickname: `${acc}`,
      password,
    };

    const message = C_LogIn.create(payload);
    const buffer = C_LogIn.encode(message).finish();

    const packetLength = Buffer.alloc(4);
    packetLength.writeUInt32LE(buffer.length + 4 + 1, 0);

    const packetType = Buffer.alloc(1);
    packetType.writeUInt8(203, 0);

    context.client.write(Buffer.concat([packetLength, packetType, buffer]), () => {
      events.emit('log', 'Login request sent');
      done();
    });
  },
  receiveLoginResponse: function (context, events, done) {
    context.client.once('data', (data) => {
      const packet = data.slice(5);
      const response = S_LogIn.decode(packet);
      if (response.success) {
        events.emit('log', 'Login successful!');
      } else {
        events.emit('log', `Login failed: ${response.message}`);
      }
      done();
    });
  },
  sendEnterRequest: function (context, events, done) {
    const payload = {
      nickname: `${acc}`,
      class: 1001,
    };

    const message = C_Enter.create(payload);
    const buffer = C_Enter.encode(message).finish();

    const packetLength = Buffer.alloc(4);
    packetLength.writeUInt32LE(buffer.length + 4 + 1, 0);

    const packetType = Buffer.alloc(1);
    packetType.writeUInt8(0, 0);

    context.client.write(Buffer.concat([packetLength, packetType, buffer]), () => {
      events.emit('log', 'Enter request sent');
      done();
    });
  },
  receiveEnterResponse: function (context, events, done) {
    context.client.once('data', (data) => {
      const packet = data.slice(5);
      // const response = S_Enter.decode(packet);
      // events.emit("log", response);
      done();
    });
  },
};
