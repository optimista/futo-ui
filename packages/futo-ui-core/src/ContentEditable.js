import clsx from 'clsx'
import { equal } from '@futo-ui/utils'
import { withStyles } from '@material-ui/core/styles'
import React, { Component, createRef, forwardRef } from 'react'

const generateGutter = theme => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(s => theme.spacing(s) !== 0).reduce((acc, cur) => {
    acc[`spacing-${cur}`] = { padding: theme.spacing(cur) }; return acc;
  }, {});
}

const styles = theme => ({
  ...generateGutter(theme),
  base: {
    cursor: "text",
    display: "inline-block",
    outline: "none",
    minWidth: 1,
    '&:empty:before': {
      color: "#aaaaaa",
      content: "attr(placeholder)"
    }
  },
  root: {}
});

class ContentEditable extends Component {
  constructor(props) {
    super(props);
    this.ref = props.innerRef || createRef();
    this.handleBlur = this.handleBlur.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { current } = this.ref;
    return current.innerText !== nextProps.html || !equal(this.props.style, nextProps.style);
  }
  componentDidUpdate() { const el = this.ref.current; if (this.props.html !== el.innerText) el.innerText = this.props.html; }
  handleBlur(e) { const { onBlur } = this.props; onBlur && onBlur(e); }
  handleInput(e) { const { onChange } = this.props; onChange && onChange({ target: { value: e.target.innerText } }); }
  handleKeyDown(e) { const { onKeyDown } = this.props; onKeyDown && onKeyDown(e); }
  handlePaste(e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand("insertText", false, text);
  }

  render() {
    const { classes, className, html = "", innerRef, onBlur, onKeyDown, placeholder, spacing, ...props } = this.props;
    return <div className={clsx(classes.base, classes.root, className, { [classes['spacing-'+spacing]]: spacing })} contentEditable dangerouslySetInnerHTML={{ __html: html }} onBlur={this.handleBlur} onInput={this.handleInput} onKeyDown={this.handleKeyDown} onPaste={this.handlePaste} placeholder={placeholder} ref={this.ref} {...props}></div>;
  }
}

export default withStyles(styles, { name: "FuiContentEditable" })(forwardRef((props, ref) => <ContentEditable innerRef={ref} {...props} />));
