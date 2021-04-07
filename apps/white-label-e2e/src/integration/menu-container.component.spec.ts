describe('white-label', () => {
  beforeEach(() => cy.visit('/iframe.html?id=menucontainercomponent--primary&knob-options&knob-gutter&knob-wings&knob-startAngles'));

  it('should render the component', () => {
    cy.get('app-menu-container').should('exist');
  });
});
