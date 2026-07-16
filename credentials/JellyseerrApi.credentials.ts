import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class JellyseerrApi implements ICredentialType {
	name = 'jellyseerrApi';

	displayName = 'Jellyseerr API';

	icon = 'file:jellyseerrApi.svg' as const;

	documentationUrl = 'https://github.com/fallenbagel/jellyseerr';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://jellyseerr:5055',
			required: true,
			description:
				'Base URL of the Jellyseerr instance (e.g. http://jellyseerr:5055). No trailing slash.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Jellyseerr API key (Settings → General → API Key)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/status',
		},
	};
}
