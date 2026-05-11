/**
 * Generates static icon JSON files by rendering each icon to an SVG string at
 * build time, so the browser can lazy-load families without bundling catalogs.
 *
 * Run: node scripts/generate-icons-ts.js
 */

'use strict';

const path = require( 'path' );
const fs   = require( 'fs' );

const root      = path.resolve( __dirname, '..' );
const React     = require( path.join( root, 'node_modules/react' ) );
const Server    = require( path.join( root, 'node_modules/react-dom/server' ) );
const wpIcons   = require( path.join( root, 'node_modules/@wordpress/icons' ) );
const muiIcons  = require( path.join( root, 'node_modules/@mui/icons-material' ) );

const outDir = path.join( root, 'assets/icons' );
fs.mkdirSync( outDir, { recursive: true } );

// ─── Helpers ─────────────────────────────────────────────────────────────────

function camelToKebab( str ) {
	return str.replace( /([A-Z])/g, ( m ) => `-${ m.toLowerCase() }` );
}

function camelToLabel( str ) {
	return str.replace( /([A-Z])/g, ' $1' ).replace( /^./, ( s ) => s.toUpperCase() ).trim();
}

function writeJson( family, entries ) {
	fs.writeFileSync(
		path.join( outDir, `${ family }.json` ),
		JSON.stringify( entries, null, '\t' ) + '\n',
		'utf8'
	);
	console.log( `  → ${ entries.length } ${ family } icons written` );
}

function normalizeSvgSource( source ) {
	let normalizedSource = source;

	const widthMatch = normalizedSource.match( /\swidth="([0-9.]+)"/i );
	const heightMatch = normalizedSource.match( /\sheight="([0-9.]+)"/i );
	const hasViewBox = /\sviewBox="[^"]+"/i.test( normalizedSource );
	const hasXmlns = /\sxmlns="[^"]*"/i.test( normalizedSource );

	if ( ! hasViewBox && widthMatch && heightMatch ) {
		normalizedSource = normalizedSource.replace(
			/<svg\b/i,
			`<svg viewBox="0 0 ${ widthMatch[ 1 ] } ${ heightMatch[ 1 ] }"`
		);
	}

	// Ensure SVG has xmlns namespace for proper rendering
	if ( ! hasXmlns ) {
		normalizedSource = normalizedSource.replace(
			/<svg\b/i,
			'<svg xmlns="http://www.w3.org/2000/svg"'
		);
	}

	normalizedSource = normalizedSource.replace(
		/\sviewBox="0\s+0\s+var\([^\)]*\)\s+var\([^\)]*\)"/gi,
		' viewBox="0 0 24 24"'
	);

	return normalizedSource
		.replace( /<style[^>]*>[\s\S]*?<\/style>/g, '' )
		.replace( /\swidth="[^"]*"/g, '' )
		.replace( /\sheight="[^"]*"/g, '' )
		.replace( /\sclass="[^"]*"/g, '' )
		.replace( /\sdata-testid="[^"]*"/g, '' )
		.replace( /\sfocusable="[^"]*"/g, '' )
		.replace( /\saria-hidden="[^"]*"/g, '' );
}

function stripMuiVariant( icon, suffix, labelSuffix ) {
	return {
		...icon,
		name: icon.name.slice( 0, -suffix.length ),
		label: icon.label.replace( new RegExp( ` ${ labelSuffix }$` ), '' ),
	};
}

// ─── WordPress icons ──────────────────────────────────────────────────────────

console.time( 'wordpress' );
const wordpressIcons = Object.entries( wpIcons )
	.filter( ( [ , value ] ) => React.isValidElement( value ) )
	.map( ( [ name, icon ] ) => ( {
		name:   camelToKebab( name ),
		label:  camelToLabel( name ),
		source: Server.renderToString( icon ),
	} ) );

writeJson( 'wordpress', wordpressIcons );
console.timeEnd( 'wordpress' );

// ─── MUI icons ────────────────────────────────────────────────────────────────

console.time( 'mui' );
const muiMaterialIcons = Object.entries( muiIcons )
	.filter( ( [ name, value ] ) =>
		!/^(default|createSvgIcon)$/i.test( name ) &&
		typeof value === 'object' &&
		value !== null &&
		'$$typeof' in value
	)
	.map( ( [ name, Component ] ) => ( {
		name: camelToKebab( name ).replace( /^-/, '' ),
		label: camelToLabel( name ),
		source: normalizeSvgSource(
			Server.renderToString( React.createElement( Component, {} ) )
		),
	} ) );

writeJson(
	'mui',
	muiMaterialIcons.filter(
		( icon ) =>
			! /(?:-outlined|-rounded|-sharp|-two-tone)$/.test( icon.name )
	)
);

writeJson(
	'mui-outlined',
	muiMaterialIcons
		.filter( ( icon ) => icon.name.endsWith( '-outlined' ) )
		.map( ( icon ) => stripMuiVariant( icon, '-outlined', 'Outlined' ) )
);

writeJson(
	'mui-rounded',
	muiMaterialIcons
		.filter( ( icon ) => icon.name.endsWith( '-rounded' ) )
		.map( ( icon ) => stripMuiVariant( icon, '-rounded', 'Rounded' ) )
);

writeJson(
	'mui-sharp',
	muiMaterialIcons
		.filter( ( icon ) => icon.name.endsWith( '-sharp' ) )
		.map( ( icon ) => stripMuiVariant( icon, '-sharp', 'Sharp' ) )
);

console.timeEnd( 'mui' );
