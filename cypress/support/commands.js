Cypress.Commands.add("login", (username, password) => {
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[class*="login"]').click();
});

Cypress.Commands.add("deleteUser", (username) => {
  cy.get("label")
    .contains("Username")
    .parent()
    .parent()
    .find("div")
    .eq(1)
    .type(username);

  // Click on Submit
  cy.get('button[type="submit"]').click({ force: true });

  cy.wait(1000);

  // Delete it in case exists
  cy.get("body").then(($body) => {
    if ($body.find('div.oxd-table-card > div[role="row"]').length > 0) {
      cy.get('div.oxd-table-card > div[role="row"]').each(
        ($element, index, $list) => {
          if ($element.find("div").eq(3).text().includes(username)) {
            cy.wrap($element).find("div i.bi-trash").parent().click();
            cy.get("div.orangehrm-modal-footer > button > i.bi-trash").click();
          }
        }
      );
    }
  });
});

Cypress.Commands.add("search", (label, value) => {
  cy.get("label")
    .contains(label)
    .parent()
    .parent()
    .find("div:last-child input")
    .type(value);

  cy.get('button[type="submit"]').click({ force: true });

  cy.wait(1000);
});

Cypress.Commands.add("selectOption", (field, value) => {
  cy.get("label").contains(field).parent().parent().find("div").eq(1).click();

  cy.get('div[role="listbox"] > div[role="option"]').each(($element) => {
    if ($element.text().includes(value)) cy.wrap($element).click();
  });
});

Cypress.Commands.add("typeInField", (field, value) => {
  cy.get("label")
    .contains(field)
    .parent()
    .parent()
    .find("div")
    .eq(1)
    .type(value);
});

Cypress.Commands.add("editUser", (username, newDetails) => {
  // Locate the user in the list and click the edit button
  cy.get("body").then(($body) => {
    if ($body.find('div.oxd-table-card > div[role="row"]').length > 0) {
      cy.get('div.oxd-table-card > div[role="row"]').each(($element) => {
        if ($element.find("div").eq(3).text().includes(username)) {
          cy.wrap($element)
            .find("div i.bi-pencil-fill")
            .parent()
            .click({ force: true });

          // Verify that the edit page has opened
          cy.get("h6.oxd-text.oxd-text--h6.orangehrm-main-title").should(
            "contain.text",
            "Edit User"
          );

          if (newDetails.userRole) {
            cy.selectOption("User Role", newDetails.userRole);
          }

          if (newDetails.status) {
            cy.selectOption("Status", newDetails.status);
          }

          if (newDetails.employeeName) {
            cy.get("label")
              .contains("Employee Name")
              .parent()
              .parent()
              .find("input")
              .clear();

            cy.typeInField("Employee Name", newDetails.employeeName);
            cy.wait(5000);

            cy.get('div[role="listbox"]')
              .find(".oxd-autocomplete-option")
              .each(($element, index, $list) => {
                if ($element.text().includes(newDetails.employeeName))
                  cy.wrap($element).click();
              });
          }

          if (newDetails.username) {
            cy.get("label")
              .contains("Username")
              .parent()
              .parent()
              .find("input")
              .clear();

            cy.typeInField("Username", newDetails.username);
          }

          if (newDetails.password) {
            cy.get("label")
              .contains("Yes")
              .find('input[type="checkbox"]')
              .parent()
              .click();
            cy.wait(1000);
            cy.get(".oxd-form-row.user-password-row").should("be.visible");

            // Verify that the password input field is visible
            cy.get('input[type="password"]').eq(0).should("be.visible");

            cy.get('input[type="password"]').eq(1).should("be.visible");

            cy.get('input[type="password"]').eq(0).type(newDetails.password);
            cy.get('input[type="password"]').eq(1).type(newDetails.password);
          }
          cy.get("button").contains("Save").click({ force: true });
          cy.wait(5000);
        }
      });
    }
  });
});
