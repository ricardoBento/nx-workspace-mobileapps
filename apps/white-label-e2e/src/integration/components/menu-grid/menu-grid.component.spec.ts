describe('white-label', () => {
  beforeEach(() => cy.visit('/iframe.html?id=menugridcomponent--primary'));

  it('should render the component', () => {
    cy.get('menu-grid').should('exist');
  });
});
