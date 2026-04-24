import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	PanelRow,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { FC } from 'react';

type IconPositionControlProps = {
	isLeft: boolean;
	onChange: ( isLeft: boolean ) => void;
};

export const IconPositionControl: FC< IconPositionControlProps > = ( {
	isLeft,
	onChange,
} ) => {
	const handleChange = ( value?: string | number ) => {
		if ( undefined === value ) {
			return;
		}

		onChange( 'left' === String( value ) );
	};

	return (
		<PanelRow className="enable-button-icons-control-wrapper">
			<ToggleGroupControl
				label={ __( 'Icon position', 'enable-button-icons' ) }
				value={ isLeft ? 'left' : 'right' }
				onChange={ handleChange }
				isBlock
				className="enable-button-icons-toggle-group-control"
			>
				<ToggleGroupControlOption
					value="left"
					label={ __( 'Left', 'enable-button-icons' ) }
					className={ isLeft ? 'is-selected' : '' }
				/>
				<ToggleGroupControlOption
					value="right"
					label={ __( 'Right', 'enable-button-icons' ) }
					className={ ! isLeft ? 'is-selected' : '' }
				/>
			</ToggleGroupControl>
		</PanelRow>
	);
};
