describe('white-label', () => {
  beforeEach(() => cy.visit('/iframe.html?id=ngxionicimageviewercomponent--primary&knob-alt&knob-cssClass&knob-scheme&knob-slideOptions&knob-src&knob-srcFallback&knob-srcHighRes&knob-swipeToClose&knob-text&knob-title&knob-titleSize'));

  it('should render the component', () => {
    cy.get('ion-img-viewer').should('exist');
  });
});
