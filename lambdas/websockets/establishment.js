const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

var uuid = require('uuid');

const estTableName = process.env.establishmentTableName;

exports.handler = async event => {
  console.log('event', event);

  // For future response sending
  const { domainName, stage, connectionId } = event.requestContext;

  const body = JSON.parse(event.body);
  if (typeof body.method === 'string') {
    switch (body.method) {
      case 'create':
        const id = uuid.v4();
        const data = {
          ID: id,
          name: body.params.name,
          created: Date.now()
        };
        await Dynamo.write(data, estTableName);

        // Send response
        await WebSocket.send({
          domainName,
          stage,
          connectionId,
          message: JSON.stringify({
            result: {
              ID: id
            },
            id: body.id
          })
        });

        return Responses._200({});
      default:
        return Responses._400({message: 'method is unknown'});
    }
  }
  else {
    return Responses._400({message: 'method is missing or invalid'});
  }
}