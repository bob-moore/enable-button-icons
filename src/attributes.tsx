export const addButtonIconAttributes = ( settings: any, name: string ) => {
	if ( 'core/button' !== name ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			icon: {
				type: 'object',
			},
			iconSize: {
				type: 'string',
				default: '',
			},
			iconPositionLeft: {
				type: 'boolean',
				default: false,
			},
		},
	};
};
