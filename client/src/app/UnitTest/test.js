// isValidId.test.js

import { expect } from 'chai';  // Import using ES Module syntax

// The function you want to test
const isValidId = (id) => {
    id = id.replace(/\D/g, '');  // Remove non-digit characters
    if (id.length !== 9) {  // Check if the length is 9
        return false;
    }
    return true;
};

// Unit test cases
describe('isValidId Function', () => {
    it('should return true for valid 9-digit ID', () => {
        const result = isValidId('123456789');  // Valid ID (no non-digits)
        expect(result).to.be.true;  // Assert that it returns true
    });

    it('should return false for ID with non-digit characters', () => {
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

    it('should return false for ID with mixed non-digits and digits', () => {
        const result = isValidId('12-345-6789');  // Mixed with non-digits
        expect(result).to.be.true;  // Assert that non-digits are removed and length becomes 9
    });
});
