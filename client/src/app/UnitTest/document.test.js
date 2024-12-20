import { expect } from 'chai';  // Import using ES Module syntax

// The function you want to test
const isValidId = (id) => {
    id = id.replace(/\D/g, '');  // Remove non-digit characters
    if (id.length !== 9) {  // Check if the length is 9
        return false;
    }
    return true;
};

// Email validation function (for example SCE email validation)
const isValidEmail = (email) => {
    const sceEmailRegex = /^[a-zA-Z0-9._%+-]+@sce\.edu$/;  // Regex for SCE emails
    return sceEmailRegex.test(email);
};

// Unit test cases
describe('Validation Functions', () => {
    // Test for ID validation
    describe('isValidId Function', () => {
        it('should return true for valid 9-digit ID', () => {
            const result = isValidId('123456789');  // Valid ID (no non-digits)
            expect(result).to.be.true;  // Assert that it returns true
        });

        it('should return true for ID with non-digit characters', () => {
            const result = isValidId('123-456-789');  // ID with hyphens
            expect(result).to.be.true;  // Assert that non-digits are removed
        });

        it('should return false for ID with less than 9 digits', () => {
            const result = isValidId('12345');  // ID with only 5 digits
            expect(result).to.be.false;  // Assert that it returns false
        });

        it('should return false for ID with more than 9 digits', () => {
            const result = isValidId('1234567890');  // ID with 10 digits
            expect(result).to.be.false;  // Assert that it returns false
        });

        it('should return true for ID with mixed non-digits and digits and total length of 9 digits', () => {
            const result = isValidId('12-345-6789');  // Mixed with non-digits
            expect(result).to.be.true;  // Assert that non-digits are removed and length becomes 9
        });
    });

    const validateEmail = (email) => {
        const sceEmailRegex = /^[a-zA-Z0-9._%+-]+@sce\.edu$/; // Update the regex as per the SCE email format
        return sceEmailRegex.test(email);
    };




    // Test for Email validation
    describe('isValidEmail Function', () => {
        it('should return true for a valid SCE email', () => {
            const result = validateEmail('john.doe@sce.edu');  // Valid SCE email
            expect(result).to.be.true;  // Assert that it returns true
        });

        it('should return false for email with incorrect domain', () => {
            const result = isValidEmail('john.doe@gmail.com');  // Invalid email domain
            expect(result).to.be.false;  // Assert that it returns false
        });

        it('should return false for email with missing "@" symbol', () => {
            const result = isValidEmail('john.doe.sce.edu');  // Missing '@' symbol
            expect(result).to.be.false;  // Assert that it returns false
        });

        it('should return false for email with additional non-alphanumeric characters', () => {
            const result = isValidEmail('john.doe@!sce.edu');  // Invalid special character
            expect(result).to.be.false;  // Assert that it returns false
        });

        it('should return false for email with an invalid TLD', () => {
            const result = isValidEmail('john.doe@sce.com');  // Invalid TLD (.com instead of .edu)
            expect(result).to.be.false;  // Assert that it returns false
        });
    });
});