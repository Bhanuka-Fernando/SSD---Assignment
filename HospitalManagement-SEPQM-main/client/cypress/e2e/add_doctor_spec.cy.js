describe('Add Doctor Functionality', () => {

    beforeEach(() => {
      // Admin logs into the system before each test using email and password
      cy.visit('http://localhost:3000/adminLogin');  
      
      // Ensure the login page is fully loaded
      cy.url().should('include', '/adminLogin');
      
      // Log in as Admin (using email and password)
      cy.get('input[type="text"]').type('sachin@gmail.com'); 
    cy.get('input[type="password"]').type('sachin');  
    cy.get('button[type="submit"]').click();  
      
      // Verify Admin is logged in 
      cy.url().should('include', '/laboratory');  
    });
  
    it('should successfully add a doctor with valid details', () => {
      // Navigate to the Add Doctor page
      cy.contains('Add Doctor').click();  
      
      // Fill in the Add Doctor form with valid details
      cy.get('input[placeholder="Name"]').type('Dr. Dulan Imalka');
      cy.get('input[placeholder="Email"]').type('dulanimalka@gmail.com');
      cy.get('input[placeholder="Password"]').type('Dulan12345');
      cy.get('input[placeholder="Specialization"]').type('Cardiology');
      cy.get('input[placeholder="Qualifications"]').type('MBBS');

      // Spy on the window's alert function
  cy.window().then((window) => {
    cy.stub(window, 'alert').callsFake((msg) => {
      expect(msg).to.equal('Doctor Created');  
    });
  });
      
      // Click the Add Doctor button
      cy.get('button').contains('Add Doctor').click();
  
      // Verify success message and doctor list
      cy.window().its('alert').should('be.calledWith', 'Doctor Created');
      cy.contains('Dr. Dulan Imalka').should('be.visible');
    });
  

    //invalid test 01 (invalid email format)

    it('should show an error if the email format is invalid', () => {
        // Navigate to the Add Doctor page
        cy.contains('Add Doctor').click();
    
        // Fill out the form with invalid email
        cy.get('input[placeholder="Name"]').type('Dr. Dulan Imalka');
        cy.get('input[placeholder="Email"]').type('dulangmail');  // Invalid email
        cy.get('input[placeholder="Password"]').type('Password123!');
        cy.get('input[placeholder="Specialization"]').type('Dermatology');
        cy.get('input[placeholder="Qualifications"]').type('MD');
    
        // Click the Add Doctor button
        cy.get('button').contains('Add Doctor').click();
    
        // Ensure the error message is visible
        cy.contains('Please include an \'@\' in the email address.').should('be.visible');
    });
});
  