describe("Claim test cases", () => {
  let claimID;

  beforeEach(() => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    );
    cy.fixture("data").then((data) => {
      cy.login(data.username, data.password);
    });

    cy.get("h6.oxd-text").should("have.text", "Dashboard");
  });

  it("Assign a claim and retrieve claim ID", () => {
    cy.visitClaimModule();
    cy.url().should(
      "eq",
      "https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim"
    );

    cy.assignClaim();
    cy.get("input.oxd-input[disabled]")
      .eq(1)
      .invoke("val")
      .then((id) => {
        claimID = id;
        cy.log("Claim ID:", claimID);
        cy.wrap(claimID).as("claimID");
      });
  });

  it("Add an expense and verify", () => {
    cy.visitClaimModule();
    cy.url().should(
      "eq",
      "https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim"
    );

    cy.fixture("data").then((data) => {
      cy.search("Reference Id", claimID);
    });
    cy.get("button").contains("Search").click();

    cy.get(
      "button.oxd-button.oxd-button--medium.oxd-button--text.oxd-table-cell-action-space"
    ).click();

    // Add an expense for the claim
    cy.addExpense();

    cy.wait(2000);
    cy.get(
      "button.oxd-button.oxd-button--medium.oxd-button--secondary.orangehrm-sm-button"
    )
      .should("be.visible")
      .click();
    cy.wait(2000);
  });
});

// Helper functions

// Navigate to Claim Module
Cypress.Commands.add("visitClaimModule", () => {
  cy.get('a[href="/web/index.php/claim/viewClaimModule"]')
    .should("be.visible")
    .click();
});

// Assign a claim
Cypress.Commands.add("assignClaim", () => {
  cy.get("button").contains("Assign Claim").click();
  cy.get("form").should("be.visible");

  cy.fixture("data").then((data) => {
    cy.typeInField("Employee Name", data.employeeName);
    cy.get('div[role="listbox"]').contains(data.employeeName).click();
    cy.selectOption("Event", data.event);
    cy.selectOption("Currency", data.currency);
  });

  cy.get('button[type="submit"]').click();
  cy.wait(2000);
  cy.url().should("contain", "assignClaim");
  cy.wait(5000);
});

Cypress.Commands.add("addExpense", () => {
  cy.get("button").contains("Add").click();

  // Fill in the expense form
  cy.fixture("data").then((data) => {
    cy.selectOption("Expense Type", data.expenseType);
    cy.get("i.oxd-icon.bi-calendar.oxd-date-input-icon").click();
    cy.get(".oxd-calendar-date").contains("3").click();
    cy.typeInField("Amount", data.amount);
  });

  // Submit the form and verify success
  cy.get("button").contains("Save").click();
  cy.wait(2000);
  cy.get(
    "p.oxd-text.oxd-text--p.oxd-text--toast-message.oxd-toast-content-text"
  ).should("have.text", "Successfully Saved");
});
