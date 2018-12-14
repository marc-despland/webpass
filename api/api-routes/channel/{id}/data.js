module.exports = {
	// parameters for all operations in this path
	parameters: [
		{
			name: 'id',
			in: 'path',
			type: 'string',
			required: true,
			description: 'ChannelId'
		}
	],
	post: [function(req, res, next) {next();}, post]
};

function post(req, res) {
	console.log("Received data : "+JSON.stringify(req.body));
	console.log("Received data : "+JSON.stringify(req.params));
	console.log("Login : "+req.body.login);
	res.status(204).end();
}

// verify that apiDoc is available with middleware
post.apiDoc = {
	description: 'Send data to a channel.',
	operationId: 'sendData',
	tags: ['users'],
	parameters: [
		{
			name: 'data',
			in: 'body',
			schema: {
				$ref: '#/definitions/Data'
			}
		}
	],

	responses: {
		204: {
			description: "Data successfully sent"
		},
		default: {
			description: "Unexpected error",
			schema: {
				$ref: '#/definitions/Error'
			}
		}
	}
};

