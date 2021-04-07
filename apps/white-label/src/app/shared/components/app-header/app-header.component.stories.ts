import { text, number, boolean } from '@storybook/addon-knobs';
import { AppHeaderComponent } from './app-header.component';

export default {
  title: 'AppHeaderComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: AppHeaderComponent,
  props: {
    title: text('title', ''),
    back_button: boolean('back_button', false),
    back_to: boolean('back_to', false),
  }
})