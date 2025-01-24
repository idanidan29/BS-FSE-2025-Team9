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
    console.log('Processed Car Number:', carNumberStr); // בדיקת ערך

    if (carNumberStr.length < 7 || carNumberStr.length > 8) {
        console.log('Length Error:', carNumberStr.length);
        return { isValid: false, error: "Car number must be 7 or 8 digits long." };
    }
    if (!/^\d+$/.test(carNumberStr)) {
        console.log('Non-digit Error:', carNumberStr);
        return { isValid: false, error: "Car number must contain only digits." };
    }

    return { isValid: true };
};



