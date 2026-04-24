export type IconValue = {
	name: string;
	iconSet: string;
	label: string;
	src: string;
} | null;

export type ButtonAttributes = {
	icon: IconValue;
	iconSize: string;
	iconPositionLeft: boolean;
	className?: string;
};

export type BlockEditProps< T = {} > = {
	attributes: T;
	setAttributes: ( attrs: Partial< T > ) => void;
	clientId: string;
	isSelected: boolean;
	context: Record< string, any >;
	name: string;
};

export type BlockTypeObject = {
	name: string;
};

export type WrapperProps = {
	style?: { [ key: string ]: any };
	className?: string;
};

export type BlockListProps = BlockTypeObject & {
	attributes: ButtonAttributes;
	wrapperProps?: WrapperProps;
	className?: string;
};
