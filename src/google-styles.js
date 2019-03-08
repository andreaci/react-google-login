const initialStyle = {
	backgroundColor: theme === 'dark' ? 'rgb(66, 133, 244)' : '#fff',
	display: 'inline-flex',
	alignItems: 'center',
	color: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, .54)',
	boxShadow: '0 2px 2px 0 rgba(0, 0, 0, .24), 0 0 1px 0 rgba(0, 0, 0, .24)',
	padding: 0,
	borderRadius: 2,
	border: '1px solid transparent',
	fontSize: 14,
	fontWeight: '500',
	fontFamily: 'Roboto, sans-serif'
};

const hoveredStyle = {
	cursor: 'pointer',
	opacity: 0.9
};

const activeStyle = {
	cursor: 'pointer',
	backgroundColor: theme === 'dark' ? '#3367D6' : '#eee',
	color: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, .54)',
	opacity: 1
};

function getDefaultStyle(disabled, active, hovered, theme, disabledStyle) {
	if (disabled) {
		return Object.assign({}, initialStyle, disabledStyle);
	}

	if (active) {
		if (theme === 'dark') {
			return Object.assign({}, initialStyle, activeStyle);
		}

		return Object.assign({}, initialStyle, activeStyle);
	}

	if (hovered) {
		return Object.assign({}, initialStyle, hoveredStyle);
	}

	return initialStyle;
}

export default getDefaultStyle;
