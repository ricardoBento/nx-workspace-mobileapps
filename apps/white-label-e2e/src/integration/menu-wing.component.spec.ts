describe('white-label', () => {
  beforeEach(() => cy.visit('/iframe.html?id=menuwingcomponent--primary&knob-wing&knob-index&knob-svgPath&knob-position'));

  it('should render the component', () => {
    cy.get('app-menu-wing').should('exist');
  });
});
