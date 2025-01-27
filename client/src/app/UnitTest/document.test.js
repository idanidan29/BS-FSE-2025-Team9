import { expect } from 'chai'; // Import the "expect" function from Chai for assertions

// Function to validate if an ID is valid
export const isValidId = (id) => {
    id = id.replace(/\D/g, '');  // Remove all non-digit characters from the ID
    if (id.length !== 9) {  // Check if the cleaned ID is exactly 9 digits long
        return { isValid: false, error: "ID must have 9 digits exactly." }; // Return false with an error message if invalid
    }
    return { isValid: true }; // Return true if the ID is valid
};

// Function to validate if an email is a valid SCE email
export const isValidEmail = (email) => {
    const sceEmailRegex = /^[a-zA-Z0-9._%+-]+@sce\.il$/;  // Define a regex pattern to match SCE emails
    if (!sceEmailRegex.test(email)) { // Check if the email matches the regex
        return { isValid: false, error: "Invalid email format. It must end with @sce.il"}; // Return false if the email doesn't match
    }
    return { isValid: true }; // Return true if the email is valid
};

// Function to validate car numbers (7 or 8 digits only)
export const isValidcarNumber = (carNumber) => {
    const carNumberStr = String(carNumber).trim(); // Convert the car number to a string and trim spaces

    if (carNumberStr.length < 7 || carNumberStr.length > 8) { // Check if the length is not 7 or 8
        return { isValid: false, error: "Car number must be 7 or 8 digits long." }; // Return false with an error message
    }
    if (!/^\d+$/.test(carNumberStr)) { // Check if the car number contains only digits
        return { isValid: false, error: "Car number must contain only digits." }; // Return false if it contains letters or symbols
    }

    return { isValid: true }; // Return true if the car number is valid
};

// Unit tests for validation functions
describe("Validation Functions", () => {

  // Unit tests for isValidId function
  describe("isValidId", () => {

    it("should return false if the ID has less than 9 digits", () => {
      const result = isValidId("12345678"); // Test with an ID that's too short
      expect(result.isValid).to.be.false; // Assert that the result is invalid
      expect(result.error).to.equal("ID must have 9 digits exactly."); // Check the error message
    });

    it("should return false if the ID has more than 9 digits", () => {
      const result = isValidId("1234567890"); // Test with an ID that's too long
      expect(result.isValid).to.be.false; // Assert that the result is invalid
      expect(result.error).to.equal("ID must have 9 digits exactly."); // Check the error message
    });

    it("should return true for a valid 9-digit ID", () => {
      const result = isValidId("123456789"); // Test with a valid ID
      expect(result.isValid).to.be.true; // Assert that the result is valid
    });

    it("should strip non-digit characters and validate correctly", () => {
      const result = isValidId("123-45-6789"); // Test with a valid ID containing hyphens
      expect(result.isValid).to.be.true; // Assert that it still validates correctly
    });

    it("should return true after removing non-digit characters from a valid ID", () => {
      const result = isValidId("123-456-789"); // Test with a valid ID containing non-digit characters
      expect(result.isValid).to.be.true; // Assert that it validates correctly
    });
  });

  // Unit tests for isValidEmail function
  describe("isValidEmail", () => {

    it("should return false for an invalid email format", () => {
      const result = isValidEmail("user@domain.com"); // Test with an invalid domain
      expect(result.isValid).to.be.false; // Assert that the result is invalid
      expect(result.error).to.equal("Invalid email format. It must end with @sce.il"); // Check the error message
    });

    it("should return true for a valid SCE email", () => {
      const result = isValidEmail("user@sce.il"); // Test with a valid SCE email
      expect(result.isValid).to.be.true; // Assert that the result is valid
    });

    it("should return false for email missing @sce.il", () => {
      const result = isValidEmail("user@gmail.com"); // Test with an invalid domain
      expect(result.isValid).to.be.false; // Assert that the result is invalid
      expect(result.error).to.equal("Invalid email format. It must end with @sce.il"); // Check the error message
    });

    it("should return false for email with special characters not allowed", () => {
      const result = isValidEmail("user@@sce.il"); // Test with invalid characters
      expect(result.isValid).to.be.false; // Assert that the result is invalid
      expect(result.error).to.equal("Invalid email format. It must end with @sce.il"); // Check the error message
    });
  });

  // Unit tests for isValidcarNumber function
  describe("isValidcarNumber", () => {

    it("should return false for a car number with less than 7 digits", () => {
      const result = isValidcarNumber("12345"); // Test with a short car number
      expect(result.isValid).to.be.false; // Assert that the result is invalid
      expect(result.error).to.equal("Car number must be 7 or 8 digits long."); // Check the error message
    });

    it("should return false for a car number with more than 8 digits", () => {
      const result = isValidcarNumber("123456789"); // Test with a long car number
      expect(result.isValid).to.be.false; // Assert that the result is invalid
      expect(result.error).to.equal("Car number must be 7 or 8 digits long."); // Check the error message
    });

    it("should return false for a car number containing non-digit characters", () => {
      const result = isValidcarNumber("1234abc"); // Test with a car number containing letters
      expect(result.isValid).to.be.false; // Assert that the result is invalid
      expect(result.error).to.equal("Car number must contain only digits."); // Check the error message
    });

    it("should return true for a valid 7-digit car number", () => {
      const result = isValidcarNumber("1234567"); // Test with a valid 7-digit car number
      expect(result.isValid).to.be.true; // Assert that the result is valid
    });

    it("should return true for a valid 8-digit car number", () => {
      const result = isValidcarNumber("12345678"); // Test with a valid 8-digit car number
      expect(result.isValid).to.be.true; // Assert that the result is valid
    });

    it("should return false for a valid length but containing letters", () => {
      const result = isValidcarNumber("1234abc7"); // Test with mixed characters
      expect(result.isValid).to.be.false; // Assert that the result is invalid
      expect(result.error).to.equal("Car number must contain only digits."); // Check the error message
    });

    it("should return true for a valid car number with spaces at the ends", () => {
      const result = isValidcarNumber(" 1234567 "); // Test with spaces at the ends
      expect(result.isValid).to.be.true; // Assert that the result is valid after trimming
    });
  });

});
