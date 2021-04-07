import { text, number, boolean } from '@storybook/addon-knobs';
import { ViewerModalComponent } from './viewer-modal.component';

export default {
  title: 'ViewerModalComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: ViewerModalComponent,
  props: {
    alt: text('alt', ''),
    scheme: text('scheme', 'auto'),
    slideOptions: text('slideOptions', {}),
    src: text('src', ''),
    srcFallback: text('srcFallback', ''),
    srcHighRes: text('srcHighRes', ''),
    swipeToClose: boolean('swipeToClose', true),
    text: text('text', ''),
    title: text('title', ''),
    titleSize: text('titleSize', ''),
  }
})