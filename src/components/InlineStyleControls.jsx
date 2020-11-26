import StyleButton from './StyleButton';

const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();
    const icons = props.icons;
    return (
        <div className="RichEditor-controls">
            {icons.map(icon =>
                <StyleButton
                    key={icon.label}
                    active={currentStyle.has(icon.style)}
                    label={icon.icon}
                    onToggle={props.onToggle}
                    style={icon.style}
                />
            )}
        </div>
    );
};

export default InlineStyleControls;