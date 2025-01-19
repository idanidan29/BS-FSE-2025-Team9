import { expect } from 'chai';  // Import using ES Module syntax
import { isValidId, isValidEmail } from './validation'; // Import the validation functions


// Unit test cases
describe('Validation Functions', () => {
    // Test for ID validation
    describe('isValidId Function', () => {
        it('should return { isValid: true } for valid 9-digit ID', () => {
            const result = isValidId('123456789');  // Valid ID (no non-digits)
            expect(result).to.deep.equal({ isValid: true });// Assert that it returns true
        });

        it('should return { isValid: true }  for ID with non-digit characters', () => {
            const result = isValidId('123-456-789');  // ID with hyphens
            expect(result).to.deep.equal({ isValid: true }); // Assert that non-digits are removed
        });

        it('should return { isValid: false, error: "ID must have 9 digits exactly." } for ID with less than 9 digits', () => {
            const result = isValidId('12345');  // ID with only 5 digits
            expect(result).to.deep.equal({ isValid: false, error: "ID must have 9 digits ecactly." });   // Assert that it returns false
        });

        it('should return  { isValid: false, error: "ID must have 9 digits exactly." } for ID with more than 9 digits', () => {
            const result = isValidId('1234567890');  // ID with 10 digits
            expect(result).to.deep.equal({ isValid: false, error: "ID must have 9 digits ecactly." }); // Assert that it returns false
        });

      
        
    });

    // Test for Email validation
    describe('isValidEmail Function', () => {
        it('should return { isValid: true }  for a valid SCE email', () => {
            const result = isValidEmail('john.doe@sce.edu');  // Valid SCE email
            expect(result.isValid).to.be.true;  // Assert that it returns true
        });

        it('should return { isValid: false } for email with incorrect domain', () => {
            const result = isValidEmail('john.doe@gmail.com');  // Invalid email domain
            expect(result.isValid).to.be.false;  // Assert that it returns false
        });

        it('should return { isValid: false } for email with missing "@" symbol', () => {
            const result = isValidEmail('john.doe.sce.edu');  // Missing '@' symbol
            expect(result.isValid).to.be.false;  // Assert that it returns false
        });

        it('should return { isValid: false } for email with additional non-alphanumeric characters', () => {
            const result = isValidEmail('john.doe@!sce.edu');  // Invalid special character
            expect(result.isValid).to.be.false;  // Assert that it returns false
        });

        it('should return { isValid: false } for email with an invalid TLD', () => {
            const result = isValidEmail('john.doe@sce.com');  // Invalid TLD (.com instead of .edu)
            expect(result.isValid).to.be.false;  // Assert that it returns false
        });
    });
});
//Test for car number 
describe('isValidcarNumber Function', () => {
    it('should return { isValid: true } for a valid car number', () => {
        const result = isValidcarNumber('12345678');  // Valid car number for 8 digits
        expect(result.isValid).to.be.true;  // Assert that it returns true
    });
    it('should return { isValid: true } for a valid car number', () => {
        const result = isValidcarNumber('1234567'); // Valid car number for 7 digits
        expect(result.isValid).to.be.true;
    });

    it('should return { isValid: false } for a car number shorter than 7 digits', () => {
        const result = isValidcarNumber('123456'); // too short
        expect(result.isValid).to.be.false;
        expect(result.error).to.equal('Car number must be 7 or 8 digits long.');
    });

    it('should return { isValid: false } for a car number longer than 8 digits', () => {
        const result = isValidcarNumber('123456789'); // too long
        expect(result.isValid).to.be.false;
        expect(result.error).to.equal('Car number must be 7 or 8 digits long.');
    });

    it('should return { isValid: false } for a car number with letters', () => {
        const result = isValidcarNumber('12A4567'); // includ letters
        expect(result.isValid).to.be.false;
        expect(result.error).to.equal('Car number must contain only digits.');
    });
});

