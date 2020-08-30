import React from 'react';
import { mount } from 'enzyme';
import Index from '@pages/index.page';

describe('index page', () => {
  it('should have App component', () => {
    const subject = mount(<Index />);

    expect(subject.find('h1')).toHaveLength(1);
  });
});
