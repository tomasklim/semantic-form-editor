import { ColorPartial, Palette, SimplePaletteColorOptions } from '@material-ui/core/styles/createPalette';
import { Theme, ThemeOptions } from '@material-ui/core';

interface IPalette extends Palette {
  custom: SimplePaletteColorOptions & ColorPartial;
}

interface ITheme extends Theme {
  palette: IPalette;
  custom: any;
}

interface IThemeOptions extends ThemeOptions {
  palette: IPalette;
  custom: any;
}

export type IIntl = {
  locale?: string;
};
