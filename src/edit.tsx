import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Spinner } from '@wordpress/components';
import { lazy, Suspense, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { ComponentType, FC } from 'react';

import { IconPositionControl } from './components/IconPositionControl';
import { IconSizeControl } from './components/IconSizeControl';
import type { BlockEditProps, ButtonAttributes, IconValue } from './types';

const EMPTY_ICON: IconValue = {
	name: null,
	iconSet: null,
	label: null,
	src: null,
};

const IconPickerControl = lazy( () =>
	import( './components/IconPickerControl' ).then( ( m ) => ( {
		default: m.IconPickerControl,
	} ) )
);

type ButtonBlockEditProps = BlockEditProps< ButtonAttributes >;
type ButtonBlockEditComponent = FC< ButtonBlockEditProps >;
type WrappedButtonBlockEditComponent = ComponentType< ButtonBlockEditProps >;

export const Edit = createHigherOrderComponent<
	ButtonBlockEditComponent,
	WrappedButtonBlockEditComponent
>( ( BlockEdit ) => {
	return ( props: ButtonBlockEditProps ) => {
		const { attributes, setAttributes, name } = props;

		if ( 'core/button' !== name ) {
			return <BlockEdit { ...props } />;
		}

		useEffect( () => {
			import( './icons' ).then( ( { loadIcons } ) => loadIcons() );
		}, [] );

		const { icon, iconSize, iconPositionLeft } = attributes;

		const handleIconChange = ( nextIcon: IconValue ) => {
			const isSelectedIcon =
				icon?.name === nextIcon?.name &&
				icon?.iconSet === nextIcon?.iconSet &&
				icon?.label === nextIcon?.label &&
				icon?.src === nextIcon?.src;

			setAttributes( { icon: isSelectedIcon ? EMPTY_ICON : nextIcon } );
		};

		const handleIconSizeChange = ( value: string ) => {
			setAttributes( { iconSize: value } );
		};

		const handleIconPositionChange = ( isLeft: boolean ) => {
			setAttributes( { iconPositionLeft: isLeft } );
		};

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Icon', 'enable-button-icons' ) }
						initialOpen={ false }
					>
						<Suspense fallback={ <Spinner /> }>
							<IconPickerControl
								icon={ icon }
								onChange={ handleIconChange }
							/>
						</Suspense>
					</PanelBody>
					<PanelBody
						title={ __( 'Icon Styles', 'enable-button-icons' ) }
						initialOpen={ false }
					>
						<IconSizeControl
							value={ iconSize }
							onChange={ handleIconSizeChange }
						/>
						<IconPositionControl
							isLeft={ iconPositionLeft }
							onChange={ handleIconPositionChange }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'Edit' );
