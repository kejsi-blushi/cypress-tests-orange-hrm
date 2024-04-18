describe("Logout Functionality", () => {
  beforeEach(() => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );

    cy.fixture("data").then((data) => {
      cy.login(data.username, data.password);
    });

    cy.get("h6.oxd-text").should("have.text", "Dashboard");
  });

  it("Logs out successfully from the HRM application", () => {
    cy.wait(1000);

    cy.get(".oxd-userdropdown").should("be.visible").click();
    cy.get(":nth-child(4) > .oxd-userdropdown-link").click();

    // Verify that the user is redirected to the login page
    cy.url().should(
      "eq",
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
  });
});
