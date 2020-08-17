import { JsonLdObj } from 'jsonld/jsonld-spec';
import { FormStructureQuestion } from '../model/FormStructureQuestion';
import { ColorPartial, Palette, SimplePaletteColorOptions } from '@material-ui/core/styles/createPalette';
import { Theme, ThemeOptions } from '@material-ui/core';

export interface EForm extends JsonLdObj {
  '@graph': Array<FormStructureQuestion>;
}

interface IPalette extends Palette {
  custom: SimplePaletteColorOptions & ColorPartial;
}
interface ITheme extends Theme {
  palette: IPalette;
}
interface IThemeOptions extends ThemeOptions {
  palette: IPalette;
}
