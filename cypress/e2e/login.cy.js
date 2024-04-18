describe("Orange HRM Application - Login Tests", () => {
  it("Logs in with valid credentials", () => {
    // Navigate to the login page
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );

    // Log in with valid credentials using selectors
    cy.get('input[placeholder="Username"]').type("Admin");
    cy.get('input[placeholder="Password"]').type("admin123");
    cy.get('button[type="submit"]').click();

    // Verify successful login
    cy.url().should("include", "/web/index.php/dashboard/index");
  });

  it("Fails to log in with invalid credentials", () => {
    // Navigate to the login page
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );

    // Attempt to log in with invalid credentials using fixture/data
    cy.fixture("data").then((data) => {
      cy.login(data.incorrectUsername, data.incorrectPassword);
    });

    // Verify that an error message is visible
    cy.get('div[role="alert"]').should("be.visible");
  });

  it("Navigates to 'Forgot Your Password' page", () => {
    // Navigate to the login page
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );

    // Click on 'Forgot your password' link
    cy.get(".oxd-text.oxd-text--p.orangehrm-login-forgot-header").click();

    // Verify that the forgot password page is visible
    cy.get('button[type="button"]').should("be.visible");
  });
});
