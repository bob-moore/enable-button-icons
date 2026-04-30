import { createHigherOrderComponent } from '@wordpress/compose';

import type { BlockListProps, WrapperProps } from './types';

export const BlockList = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props: BlockListProps ) => {
		const { name, attributes } = props;

		if ( 'core/button' !== name || ! attributes?.icon?.name ) {
			return <BlockListBlock { ...props } />;
		}

		const { icon, iconSize, iconPositionLeft } = attributes;

		if ( ! icon?.src?.length ) {
			return <BlockListBlock { ...props } />;
		}

		const className = [
			props?.className,
			`has-icon__${ icon.name }`,
			iconPositionLeft && 'has-icon-position__left',
		]
			.filter( Boolean )
			.join( ' ' );

		const wrapperProps: WrapperProps = {
			...props?.wrapperProps,
			...( ( icon.src || iconSize ) && {
				style: {
					...props?.wrapperProps?.style,
					...( icon.src && {
						'--button-icon': `url("data:image/svg+xml,${ encodeURIComponent(
							icon.src
						) }")`,
					} ),
					...( iconSize && {
						'--wp-block-button--icon-size': iconSize,
					} ),
				},
			} ),
		};

		return (
			<BlockListBlock
				{ ...props }
				className={ className }
				wrapperProps={ wrapperProps }
			/>
		);
	};
}, 'BlockList' );
