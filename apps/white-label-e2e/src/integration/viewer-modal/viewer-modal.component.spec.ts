describe('white-label', () => {
  beforeEach(() => cy.visit('/iframe.html?id=viewermodalcomponent--primary&knob-alt=&knob-scheme=auto&knob-slideOptions&knob-src&knob-srcFallback=&knob-srcHighRes=&knob-swipeToClose=true&knob-text=&knob-title=&knob-titleSize='));

  it('should render the component', () => {
    cy.get('ion-viewer-modal').should('exist');
  });
});
