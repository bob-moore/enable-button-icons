import { iconStore } from '@10up/block-components';
import { dispatch } from '@wordpress/data';

import type { IconEntry, IconFamily } from './types';

export const ICON_SET_CUSTOM = 'custom';
export const ICON_SET_WORDPRESS = 'wordpress';

const registeredFamilies = new Set< string >();

export function getIconFamilies(): Record< string, IconFamily > {
	return window.enableButtonIcons?.iconFamilies ?? {};
}

export function getDefaultIconFamily(): string {
	const families = getIconFamilies();

	return families[ ICON_SET_WORDPRESS ]
		? ICON_SET_WORDPRESS
		: Object.keys( families )[ 0 ] ?? ICON_SET_CUSTOM;
}

export async function loadIconFamily( familyName: string ): Promise< void > {
	if ( registeredFamilies.has( familyName ) ) {
		return;
	}

	const family = getIconFamilies()[ familyName ];

	if ( ! family?.url ) {
		return;
	}

	const response = await window.fetch( family.url );

	if ( ! response.ok ) {
		throw new Error( `Unable to load icon family: ${ familyName }` );
	}

	const icons = ( await response.json() ) as IconEntry[];

	dispatch( iconStore ).registerIconSet( {
		name: familyName,
		label: family.label,
		icons,
	} );

	registeredFamilies.add( familyName );
}
