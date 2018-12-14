module.exports = {
	swagger: '2.0',
	basePath: '/v1',
	info: {
		title: 'webpass api',
		version: '1.0.0'
	},
	definitions: {
		Data: {
			properties: {
				login: {
					type: 'string'
				},
				password: {
					type: 'string'
				},
				message: {
					type: 'string'
				}
			}
		},
		Error: {
			properties: {
				code: {
					type: 'number'
				},
				message: {
					type: 'string'
				}
			}
		}
	},
	paths: {},
	tags: [
		{name: 'users'}
	]
};