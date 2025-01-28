// The function i'm test
export const isValidId = (id) => {
    id = id.replace(/\D/g, '');  // Remove non-digit characters
    if (id.length !== 9) {  // Check if the length is 9
        return { isValid: false, error: "ID must have 9 digits exactly." }; // Return error if invalid
    }
    return { isValid: true }; // Return valid if length is correct
};

export const isValidEmail = (email) => {
    const sceEmailRegex = /^[a-zA-Z0-9._%+-]+@sce\.il$/;  // Regex for SCE email
    if (!sceEmailRegex.test(email)) { // Check if email matches the regex
        return { isValid: false, error: "Invalid email format. It must end with @sce.il"}; // Return error if invalid
    }
    return { isValid: true }; // Return valid if email matches
};

export const  isValidcarNumber = (carNumber) => {
    const carNumberStr = String(carNumber).trim(); // Convert to string and remove whitespace
    console.log('Processed Car Number:', carNumberStr); // Log processed value for debugging

    if (carNumberStr.length < 7 || carNumberStr.length > 8) {  // Length validation
        console.log('Length Error:', carNumberStr.length); // Log error for debugging
        return { isValid: false, error: "Car number must be 7 or 8 digits long." }; // Return error if invalid length
    }
    if (!/^\d+$/.test(carNumberStr)) { // Check if only digits
        console.log('Non-digit Error:', carNumberStr); // Log error for debugging
        return { isValid: false, error: "Car number must contain only digits." }; // Return error if non-digits found
    }

    return { isValid: true }; 
};

export const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
        return { isValid: false, error: "Phone number must start with 05 and be 10 digits long." };
    }
    return { isValid: true };
};

export const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name.trim())) {
        return { isValid: false, error: "Name must only contain letters and spaces." };
    }
    return { isValid: true };
};



