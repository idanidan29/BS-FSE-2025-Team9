import { expect } from "chai";


// The function i'm test
export const isValidId = (id) => {
    id = id.replace(/\D/g, '');  // Remove non-digit characters
    if (id.length !== 9) {  // Check if the length is 9
        return { isValid: false, error: "ID must have 9 digits exactly." };
    }
    return { isValid: true };
};

export const isValidEmail = (email) => {
    const sceEmailRegex = /^[a-zA-Z0-9._%+-]+@sce\.il$/;  // Regex for SCE email
    if (!sceEmailRegex.test(email)) {
        return { isValid: false, error: "Invalid email format. It must end with @sce.il"};
    }
    return { isValid: true };
};

export const  isValidcarNumber = (carNumber) => {
    const carNumberStr = String(carNumber).trim();


    if (carNumberStr.length < 7 || carNumberStr.length > 8) {
        return { isValid: false, error: "Car number must be 7 or 8 digits long." };
    }
    if (!/^\d+$/.test(carNumberStr)) {
        return { isValid: false, error: "Car number must contain only digits." };
    }

    return { isValid: true };
};



describe("Validation Functions", () => {

  // Tests for isValidId function
  describe("isValidId", () => {

    it("should return false if the ID has less than 9 digits", () => {
      const result = isValidId("12345678");
      expect(result.isValid).to.be.false;
      expect(result.error).to.equal("ID must have 9 digits exactly.");
    });

    it("should return false if the ID has more than 9 digits", () => {
      const result = isValidId("1234567890");
      expect(result.isValid).to.be.false;
      expect(result.error).to.equal("ID must have 9 digits exactly.");
    });

    it("should return true for a valid 9-digit ID", () => {
      const result = isValidId("123456789");
      expect(result.isValid).to.be.true;
    });

    it("should strip non-digit characters and validate correctly", () => {
      const result = isValidId("123-45-6789");
      expect(result.isValid).to.be.true;
    });

    it("should return true after removing non-digit characters from a valid ID", () => {
      const result = isValidId("123-456-789");
      expect(result.isValid).to.be.true;
    });
  });

  // Tests for isValidEmail function
  describe("isValidEmail", () => {

    it("should return false for an invalid email format", () => {
      const result = isValidEmail("user@domain.com");
      expect(result.isValid).to.be.false;
      expect(result.error).to.equal("Invalid email format. It must end with @sce.il");
    });

    it("should return true for a valid SCE email", () => {
      const result = isValidEmail("user@sce.il");
      expect(result.isValid).to.be.true;
    });

    it("should return false for email missing @sce.il", () => {
      const result = isValidEmail("user@gmail.com");
      expect(result.isValid).to.be.false;
      expect(result.error).to.equal("Invalid email format. It must end with @sce.il");
    });

    it("should return false for email with special characters not allowed", () => {
      const result = isValidEmail("user@@sce.il");
      expect(result.isValid).to.be.false;
      expect(result.error).to.equal("Invalid email format. It must end with @sce.il");
    });
  });

  // Tests for isValidcarNumber function
  describe("isValidcarNumber", () => {

    it("should return false for a car number with less than 7 digits", () => {
      const result = isValidcarNumber("12345");
      expect(result.isValid).to.be.false;
      expect(result.error).to.equal("Car number must be 7 or 8 digits long.");
    });

    it("should return false for a car number with more than 8 digits", () => {
      const result = isValidcarNumber("123456789");
      expect(result.isValid).to.be.false;
      expect(result.error).to.equal("Car number must be 7 or 8 digits long.");
    });

    it("should return false for a car number containing non-digit characters", () => {
      const result = isValidcarNumber("1234abc");
      expect(result.isValid).to.be.false;
      expect(result.error).to.equal("Car number must contain only digits.");
    });

    it("should return true for a valid 7-digit car number", () => {
      const result = isValidcarNumber("1234567");
      expect(result.isValid).to.be.true;
    });

    it("should return true for a valid 8-digit car number", () => {
      const result = isValidcarNumber("12345678");
      expect(result.isValid).to.be.true;
    });

    it("should return false for a valid length but containing letters", () => {
      const result = isValidcarNumber("1234abc7");
      expect(result.isValid).to.be.false;
      expect(result.error).to.equal("Car number must contain only digits.");
    });

    it("should return true for a valid car number with spaces at the ends", () => {
      const result = isValidcarNumber(" 1234567 ");
      expect(result.isValid).to.be.true;
    });

  });

});