import React from 'react';
import { Button } from 'antd';
class StyleButton extends React.Component {
    constructor() {
      super();
      this.onToggle = (e) => {
        e.preventDefault();
        this.props.onToggle(this.props.style);
      };
    }

    render() {
      let className = 'RichEditor-styleButton';
      if (this.props.active) {
        className += ' active';
      }

      return (
          <Button className={className} type="default" size="middle" onMouseDown={this.onToggle}>
              {this.props.label}
          </Button>
      );
    }
}

export default StyleButton;