import { registerIcons } from '@10up/block-components';

export const ICON_SET_WORDPRESS = 'wordpress';
export const ICON_SET_MUI = 'mui';

let registered = false;

export async function loadIcons(): Promise< void > {
	if ( registered ) return;
	registered = true;

	const [ { wordpressIcons }, { muiIcons } ] = await Promise.all( [
		import( './icons/wordpress' ),
		import( './icons/mui' ),
	] );

	registerIcons( {
		name: ICON_SET_WORDPRESS,
		label: 'WordPress Icons',
		icons: wordpressIcons,
	} );

	registerIcons( {
		name: ICON_SET_MUI,
		label: 'MUI Icons',
		icons: muiIcons,
	} );
}
