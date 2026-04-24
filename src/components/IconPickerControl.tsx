import {
	PanelRow,
	SelectControl,
	Spinner,
	TextareaControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { IconPicker } from '@10up/block-components';
import type { FC } from 'react';

import { ICON_SET_WORDPRESS, ICON_SET_MUI, loadIcons } from '../icons';
import type { IconValue } from '../types';

const ICON_SET_CUSTOM = 'custom';

type SelectedLibrary = typeof ICON_SET_CUSTOM | string;

type IconPickerControlProps = {
	icon: IconValue;
	onChange: ( icon: IconValue ) => void;
};

const handleIconChoose = (
	iconValue: unknown,
	onChange: ( icon: IconValue ) => void,
	selectedLibrary: SelectedLibrary
) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const icon = iconValue as any;
	onChange( {
		name: icon?.name ?? '',
		iconSet: selectedLibrary,
		label: icon?.label ?? '',
		src: icon?.src ?? icon?.source ?? '',
	} );
};

export const IconPickerControl: FC< IconPickerControlProps > = ( {
	icon,
	onChange,
} ) => {
	const [ selectedLibrary, setSelectedLibrary ] = useState< SelectedLibrary >(
		( icon?.iconSet as SelectedLibrary ) ?? ICON_SET_WORDPRESS
	);
	const [ iconsReady, setIconsReady ] = useState( false );

	useEffect( () => {
		loadIcons().then( () => setIconsReady( true ) );
	}, [] );

	return (
		<>
			<SelectControl
				label={ __( 'Icon library', 'enable-button-icons' ) }
				value={ selectedLibrary }
				options={ [
					{
						label: __( 'WordPress', 'enable-button-icons' ),
						value: ICON_SET_WORDPRESS,
					},
					{
						label: __( 'MUI', 'enable-button-icons' ),
						value: ICON_SET_MUI,
					},
					{
						label: __( 'Custom', 'enable-button-icons' ),
						value: ICON_SET_CUSTOM,
					},
				] }
				onChange={ setSelectedLibrary }
			/>
			{ ICON_SET_CUSTOM === selectedLibrary ? (
				<TextareaControl
					label={ __( 'Custom SVG', 'enable-button-icons' ) }
					help={ __(
						'Paste the full SVG markup to use as the button icon.',
						'enable-button-icons'
					) }
					value={ icon?.iconSet === ICON_SET_CUSTOM ? icon.src : '' }
					onChange={ ( value ) =>
						onChange( {
							name: ICON_SET_CUSTOM,
							iconSet: ICON_SET_CUSTOM,
							label: ICON_SET_CUSTOM,
							src: value,
						} )
					}
				/>
			) : (
				<PanelRow>
					{ iconsReady ? (
						<IconPicker
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							value={
								( icon?.iconSet === selectedLibrary
									? icon
									: undefined ) as any
							}
							onChange={ ( value ) =>
								handleIconChoose(
									value,
									onChange,
									selectedLibrary
								)
							}
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							iconSet={ selectedLibrary as any }
						/>
					) : (
						<Spinner />
					) }
				</PanelRow>
			) }
		</>
	);
};
