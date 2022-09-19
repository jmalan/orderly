const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

const tableName = process.env.tableName;

exports.handler = async event => {
  console.log('event', event);

  const {connectionId} = event.requestContext;

  const body = JSON.parse(event.body);

  try {
    const record = await Dynamo.get(connectionId, tableName);
    const { messages, domainName, stage } = record;

    messages.push(body.message);

    const data = {
      ...record,
      messages
    };

    await Dynamo.write(data, tableName);

    await WebSocket.send({
      domainName,
      stage,
      connectionId,
      message: 'this is a reply to your message'
    });

    return Responses._200({message: 'got a message'});
  }
  catch (err) {
    return Responses._400({message: 'message could not be received'});
  }
}