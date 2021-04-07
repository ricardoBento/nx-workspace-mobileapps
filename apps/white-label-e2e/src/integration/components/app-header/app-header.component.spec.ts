describe('white-label', () => {
  beforeEach(() => cy.visit('/iframe.html?id=appheadercomponent--primary&knob-title&knob-back_button&knob-back_to'));

  it('should render the component', () => {
    cy.get('app-header').should('exist');
  });
});
