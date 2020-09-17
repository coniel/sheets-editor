import React from 'react';
import { render } from '@testing-library/react';
import ElementBlockquote, { ElementBlockquoteProps } from './ElementBlockquote';

const TYPE = 'blockquote';
const TEXT = 'Some text';
const ID = 'element-id';

const defaultProps: ElementBlockquoteProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
    'data-block-id': ID,
  },
  element: { type: TYPE, children: [{ text: TEXT }], id: ID },
  children: <div>{TEXT}</div>,
};

describe('ElementBlockquote', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ElementBlockquote {...defaultProps} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});