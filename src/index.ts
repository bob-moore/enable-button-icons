import { addFilter } from '@wordpress/hooks';

import { addButtonIconAttributes } from './attributes';
import { Edit } from './edit';
import { BlockList } from './blockList';

addFilter(
	'blocks.registerBlockType',
	'enable-button-icons/add-attributes',
	addButtonIconAttributes
);

addFilter(
	'editor.BlockEdit',
	'enable-button-icons/add-inspector-controls',
	Edit
);

addFilter(
	'editor.BlockListBlock',
	'enable-button-icons/add-classes',
	BlockList
);
