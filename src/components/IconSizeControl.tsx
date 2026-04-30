import {
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
	__experimentalUnitControl as UnitControl,
	PanelRow,
	RangeControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { FC } from 'react';

const ICON_SIZE_UNITS = [
	{ value: 'px', label: 'px' },
	{ value: 'em', label: 'em' },
	{ value: 'rem', label: 'rem' },
	{ value: 'vw', label: 'vw' },
	{ value: 'vh', label: 'vh' },
];

type IconSizeUnit = 'px' | 'em' | 'rem' | 'vw' | 'vh';

const ICON_SIZE_RANGE_SETTINGS: Record<
	IconSizeUnit,
	{ min: number; max: number; step: number; default: number }
> = {
	px: { min: 0, max: 200, step: 1, default: 24 },
	em: { min: 0, max: 10, step: 0.1, default: 1 },
	rem: { min: 0, max: 10, step: 0.1, default: 1 },
	vw: { min: 0, max: 100, step: 0.1, default: 5 },
	vh: { min: 0, max: 100, step: 0.1, default: 5 },
};

type IconSizeControlProps = {
	value: string;
	onChange: ( value: string ) => void;
};

export const IconSizeControl: FC< IconSizeControlProps > = ( {
	value,
	onChange,
} ) => {
	const [ parsedValue, parsedUnit ] = parseQuantityAndUnitFromRawValue(
		value || '1em',
		ICON_SIZE_UNITS
	);
	const iconSizeUnit = ( parsedUnit as IconSizeUnit | undefined ) ?? 'em';
	const iconSizeRange = ICON_SIZE_RANGE_SETTINGS[ iconSizeUnit ];
	const sliderValue =
		typeof parsedValue === 'number' ? parsedValue : iconSizeRange.default;

	const handleUnitControlChange = ( nextValue?: string ) => {
		onChange( nextValue ?? '' );
	};

	const handleSliderChange = ( nextValue?: number ) => {
		const quantity =
			typeof nextValue === 'number' ? nextValue : iconSizeRange.default;
		onChange( `${ quantity }${ iconSizeUnit }` );
	};

	return (
		<PanelRow className="enable-button-icons-control-wrapper unit-range-wrapper">
			<span className="components-base-control__label">
				{ __( 'Icon size', 'enable-button-icons' ) }
			</span>
			<div className="unit-range-wrapper__controls">
				<UnitControl
					label={ __( 'Icon size', 'enable-button-icons' ) }
					value={ value }
					onChange={ handleUnitControlChange }
					units={ ICON_SIZE_UNITS }
					__next40pxDefaultSize
					hideLabelFromVision
				/>
				<RangeControl
					label={ __( 'Icon size', 'enable-button-icons' ) }
					value={ sliderValue }
					onChange={ handleSliderChange }
					min={ iconSizeRange.min }
					max={ iconSizeRange.max }
					step={ iconSizeRange.step }
					withInputField={ false }
					hideLabelFromVision
					__next40pxDefaultSize
				/>
			</div>
		</PanelRow>
	);
};
