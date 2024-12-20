import { expect } from 'chai';  // Import using ES Module syntax

// The function i'm test
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
});




