import { text, number, boolean } from '@storybook/addon-knobs';
import { MenuWingComponent } from './menu-wing.component';

export default {
  title: 'MenuWingComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: MenuWingComponent,
  props: {
    wing: text('wing', ),
    index: number('index', 0),
    svgPath: text('svgPath', ''),
    position: text('position', ''),
  }
})