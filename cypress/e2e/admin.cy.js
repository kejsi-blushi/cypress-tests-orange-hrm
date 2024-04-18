describe("Admin test cases", () => {
  beforeEach(() => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );

    cy.fixture("data").then((data) => {
      cy.login(data.username, data.password);
    });

    cy.get("h6.oxd-text").should("have.text", "Dashboard");

    cy.get('a[href*="Admin"]').as("admin"); // Usage of alias
    cy.get("@admin").click();
  });

  it("Add a user to the system", () => {
    cy.fixture("data").then((data) => {
      // Add new user
      cy.get("button").contains("Add").click();

      cy.selectOption("User Role", data.userRole[0]);
      cy.selectOption("Status", data.status[0]);

      cy.typeInField("Employee Name", data.employeeName);
      cy.wait(2000);

      cy.get('div[role="listbox"]').contains(data.employeeName).click();

      cy.typeInField("Username", data.employeeUsername);
      cy.typeInField("Password", data.employeePassword);
      cy.typeInField("Confirm Password", data.employeePassword);

      cy.get('button[type="submit"]').click();
      cy.wait(5000);

      // Search and verify the user was added
      cy.search("Username", data.employeeUsername);

      // Assert that the user is present in the table
      cy.get('div.oxd-table-card > div[role="row"]')
        .contains(data.employeeUsername)
        .should("exist");
    });
  });

  it("Edit a user and verify the changes", () => {
    const newDetails = {
      userRole: "ESS",
      status: "Disabled",
      employeeName: "Christopher",
      username: "chris1",
      password: "newPassword123",
    };

    cy.fixture("data").then((data) => {
      cy.search("Username", data.employeeUsername);

      cy.editUser(data.employeeUsername, newDetails);
    });
  });
  const newDetails = {
    userRole: "ESS",
    status: "Disabled",
    employeeName: "Christopher",
    username: "chris1",
    password: "newPassword123",
  };
  it("Delete a user", () => {
    cy.deleteUser(newDetails.username);
  });
});
