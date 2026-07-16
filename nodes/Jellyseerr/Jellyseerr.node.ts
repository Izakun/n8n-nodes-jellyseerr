import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

export class Jellyseerr implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Jellyseerr',
		name: 'jellyseerr',
		icon: { light: 'file:jellyseerr.svg', dark: 'file:jellyseerr.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + " : " + $parameter["resource"]}}',
		description: 'Manage media requests in Jellyseerr through its v1 API',
		defaults: {
			name: 'Jellyseerr',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'jellyseerrApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Media', value: 'media' },
					{ name: 'Request', value: 'request' },
					{ name: 'Search', value: 'search' },
					{ name: 'Status', value: 'status' },
					{ name: 'User', value: 'user' },
				],
				default: 'request',
			},

			// Request operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['request'] } },
				options: [
					{ name: 'Approve', value: 'approve', action: 'Approve a request' },
					{ name: 'Create', value: 'create', action: 'Create a request' },
					{ name: 'Decline', value: 'decline', action: 'Decline a request' },
					{ name: 'Delete', value: 'delete', action: 'Delete a request' },
					{ name: 'Get', value: 'get', action: 'Get a request' },
					{ name: 'Get Many', value: 'getMany', action: 'Get many requests' },
				],
				default: 'getMany',
			},
			// Search operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['search'] } },
				options: [{ name: 'Search', value: 'search', action: 'Search for media' }],
				default: 'search',
			},
			// Media operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['media'] } },
				options: [{ name: 'Get Many', value: 'getMany', action: 'Get many media items' }],
				default: 'getMany',
			},
			// User operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['user'] } },
				options: [{ name: 'Get Many', value: 'getMany', action: 'Get many users' }],
				default: 'getMany',
			},
			// Status operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['status'] } },
				options: [{ name: 'Get', value: 'get', action: 'Get the status' }],
				default: 'get',
			},

			// ---- Fields ----
			{
				displayName: 'Request ID',
				name: 'requestId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: { resource: ['request'], operation: ['get', 'approve', 'decline', 'delete'] },
				},
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				description: 'Title to search for',
				displayOptions: { show: { resource: ['search'], operation: ['search'] } },
			},
			{
				displayName: 'Media Type',
				name: 'mediaType',
				type: 'options',
				options: [
					{ name: 'Movie', value: 'movie' },
					{ name: 'TV', value: 'tv' },
				],
				default: 'movie',
				displayOptions: { show: { resource: ['request'], operation: ['create'] } },
			},
			{
				displayName: 'Media ID (TMDB)',
				name: 'mediaId',
				type: 'number',
				default: 0,
				required: true,
				description: 'The TMDB ID of the movie or show to request',
				displayOptions: { show: { resource: ['request'], operation: ['create'] } },
			},
			{
				displayName: 'Seasons',
				name: 'seasons',
				type: 'string',
				default: 'all',
				description: 'For TV: "all" or comma-separated season numbers (e.g. 1,2)',
				displayOptions: {
					show: { resource: ['request'], operation: ['create'], mediaType: ['tv'] },
				},
			},
			{
				displayName: 'Filters',
				name: 'requestFilters',
				type: 'collection',
				placeholder: 'Add filter',
				default: {},
				displayOptions: { show: { resource: ['request'], operation: ['getMany'] } },
				options: [
					{
						displayName: 'Filter',
						name: 'filter',
						type: 'options',
						options: [
							{ name: 'All', value: 'all' },
							{ name: 'Approved', value: 'approved' },
							{ name: 'Available', value: 'available' },
							{ name: 'Pending', value: 'pending' },
							{ name: 'Processing', value: 'processing' },
							{ name: 'Unavailable', value: 'unavailable' },
						],
						default: 'all',
					},
					{ displayName: 'Take', name: 'take', type: 'number', default: 20 },
					{ displayName: 'Skip', name: 'skip', type: 'number', default: 0 },
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const credentials = await this.getCredentials('jellyseerrApi', i);
				const baseURL = (credentials.baseUrl as string).replace(/\/+$/, '');
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				const request = async (
					method: IHttpRequestMethods,
					url: string,
					opts: { qs?: IDataObject; body?: IDataObject } = {},
				) => {
					const options: IHttpRequestOptions = {
						method,
						baseURL,
						url,
						json: true,
						qs: opts.qs,
						body: opts.body,
					};
					return this.helpers.httpRequestWithAuthentication.call(this, 'jellyseerrApi', options);
				};

				const param = <T>(name: string, fallback?: T) =>
					this.getNodeParameter(name, i, fallback as T) as T;

				const setRequestStatus = (status: 'approve' | 'decline') =>
					request('POST', `/api/v1/request/${param<number>('requestId')}/${status}`);

				const handlers: Record<string, () => Promise<unknown>> = {
					'status:get': () => request('GET', '/api/v1/status'),
					'user:getMany': () => request('GET', '/api/v1/user'),
					'media:getMany': () => request('GET', '/api/v1/media'),
					'search:search': () =>
						request('GET', '/api/v1/search', { qs: { query: param<string>('query') } }),
					'request:getMany': () =>
						request('GET', '/api/v1/request', { qs: param<IDataObject>('requestFilters', {}) }),
					'request:get': () => request('GET', `/api/v1/request/${param<number>('requestId')}`),
					'request:approve': () => setRequestStatus('approve'),
					'request:decline': () => setRequestStatus('decline'),
					'request:delete': async () => {
						const requestId = param<number>('requestId');
						await request('DELETE', `/api/v1/request/${requestId}`);
						return { success: true, requestId };
					},
					'request:create': () => {
						const mediaType = param<string>('mediaType');
						const body: IDataObject = { mediaType, mediaId: param<number>('mediaId') };
						if (mediaType === 'tv') {
							const seasons = param<string>('seasons', 'all');
							body.seasons =
								seasons.trim().toLowerCase() === 'all'
									? 'all'
									: seasons
											.split(',')
											.map((s) => Number(s.trim()))
											.filter((n) => !Number.isNaN(n));
						}
						return request('POST', '/api/v1/request', { body });
					},
				};

				const handler = handlers[`${resource}:${operation}`];
				if (!handler) {
					throw new NodeOperationError(
						this.getNode(),
						`Unsupported operation: ${resource} / ${operation}`,
						{ itemIndex: i },
					);
				}
				const response = await handler();

				if (Array.isArray(response)) {
					for (const element of response) {
						returnData.push({ json: element as IDataObject, pairedItem: { item: i } });
					}
				} else {
					returnData.push({ json: response as IDataObject, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
