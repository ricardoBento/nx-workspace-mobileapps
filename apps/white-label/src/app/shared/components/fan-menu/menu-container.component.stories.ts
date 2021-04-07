import { text, number, boolean } from '@storybook/addon-knobs';
import { MenuContainerComponent } from './menu-container.component';

export default {
  title: 'MenuContainerComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: MenuContainerComponent,
  props: {
    options: text('options', ),
    gutter: text('gutter', ),
    wings: text('wings', ),
    startAngles: text('startAngles', ),
  }
})