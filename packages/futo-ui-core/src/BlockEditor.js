import React, { useEffect, useState } from 'react'

import ContentEditable from './ContentEditable'
import { useArrayRefs } from '@futo-ui/hooks'
import { blur, caret, focus, padding, scroll } from '@futo-ui/utils'

const BlockEditor = ({ blocks = [], classes = {}, offset = { bottom: 0, top: 0 }, onChange, placeholder, spacing }) => {   
  const [caretPosition, setCaretPosition] = useState({ i: 0, offset: 0 });
  const blocksRefs = useArrayRefs(blocks);
    
  useEffect(() => {
    const { i, offset } = caretPosition;
    focus(blocksRefs[i].current, offset);
  }, [caretPosition])

  const VIEWPORT_PADDING = 20;

  const block = i => {
    const el = blocksRefs[i].current, rect = el.getBoundingClientRect();
    return { bottom: rect.bottom - padding(el, "bottom"), top: rect.top + padding(el, "top") };
  }

  const viewport = () => ({
    bottom: window.innerHeight - (offset.bottom || 0) - VIEWPORT_PADDING,
    top: (offset.top || 0) + VIEWPORT_PADDING
  })

  function handleChange(i) { return e => onChange({ target: { value: blocks.map((b, j) => i === j ? e.target.value : b) } }); }

  function handleKeyDown(k) { return e => {
    const i = blocksRefs.map(ref => ref.current).indexOf(e.target),
          { startOffset, endOffset } = window.getSelection().getRangeAt(0);

    switch(e.key) {
      case 'ArrowDown':
        const isLastBlock = i === blocks.length - 1,
              isLastLine = block(i).bottom < caret().bottom + caret().height / 2;

        if (isLastLine) {
          if (!isLastBlock) {
            e.preventDefault();
            scroll.down(block(i+1).top + caret().height - viewport().bottom);
            focus({ x: caret().left, y: block(i+1).top + caret().height / 2 });
          }
        } else {
          scroll.down(caret().bottom + caret().height - viewport().bottom);
        }
        break;
      case 'ArrowUp':
        const isFirstBlock = 0 === i,
              isFirstLine = caret().top - caret().height / 2 < block(i).top;

        if (isFirstLine) {
          if (!isFirstBlock) {
            e.preventDefault(); 
            scroll.up(block(i-1).bottom - caret().height - viewport().top);
            focus({ x: caret().left, y: block(i-1).bottom - caret().height / 2 });
          }
        } else {
          scroll.up(caret().top - caret().height - viewport().top);
        }
        break;
      case 'Backspace':
        if (endOffset === 0) {
          if (0 < i) { // Join texts
            blur();
            scroll.up(block(i-1).bottom - caret().height - viewport().top);
            onChange({ target: { value: [...blocks.slice(0, i-1), blocks[i-1] + blocks[i], ...blocks.slice(i+1)] } });
            setCaretPosition({ i: i-1, offset: blocks[i-1].length });
          }
        }
        break;
      case 'Delete':
        if (endOffset === blocks[i].length) {
          if (i < blocks.length - 1) {
            blur();
            onChange({ target: { value: [...blocks.slice(0, i), blocks[i] + blocks[i+1], ...blocks.slice(i+2)] } });
            setCaretPosition({ i: i, offset: blocks[i].length });
          }
        }
        break;
      case 'Enter':
        blur();
        scroll.down(block(i+1).top + caret().height - viewport().bottom);
        onChange({ target: { value: [...blocks.slice(0, i), blocks[i].slice(0, startOffset), blocks[i].slice(endOffset), ...blocks.slice(i+1)] } });
        setCaretPosition({ i: i+1, offset: 0 });
        break;
    }
  }}

  return blocks.map((t, i) => <ContentEditable key={i} classes={{ root: classes.item }} html={t} onChange={handleChange(i)} onKeyDown={handleKeyDown(i)} placeholder={i === 0 ? placeholder : ""} ref={blocksRefs[i]} spacing={spacing} />);
}

export default BlockEditor;
