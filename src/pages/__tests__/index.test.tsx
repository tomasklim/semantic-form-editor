import React from 'react';
import { mount } from 'enzyme';
import theme from '@styles/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import Footer from '@components/structure/Footer/Footer';

describe('index page', () => {
  it('should have App component', () => {
    const subject = mount(
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    );

    expect(subject.find('footer')).toHaveLength(1);
  });
});
