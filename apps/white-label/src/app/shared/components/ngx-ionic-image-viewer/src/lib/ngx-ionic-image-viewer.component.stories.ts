import { text, number, boolean } from '@storybook/addon-knobs';
import { NgxIonicImageViewerComponent } from './ngx-ionic-image-viewer.component';

export default {
  title: 'NgxIonicImageViewerComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: NgxIonicImageViewerComponent,
  props: {
    alt: text('alt', ''),
    cssClass: text('cssClass', ),
    scheme: text('scheme', ''),
    slideOptions: text('slideOptions', ),
    src: text('src', ''),
    srcFallback: text('srcFallback', ''),
    srcHighRes: text('srcHighRes', ''),
    swipeToClose: boolean('swipeToClose', false),
    text: text('text', ''),
    title: text('title', ''),
    titleSize: text('titleSize', ''),
  }
})