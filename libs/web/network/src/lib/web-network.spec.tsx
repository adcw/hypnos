import { render } from '@testing-library/react';

import WebNetwork from './web-network';

describe('WebNetwork', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WebNetwork />);
    expect(baseElement).toBeTruthy();
  });
});
