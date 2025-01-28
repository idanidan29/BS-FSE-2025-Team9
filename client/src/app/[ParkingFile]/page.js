"use client";
import NavBar from '../components/NavBar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isValidEmail,isValidcarNumber,isValidPhoneNumber,isValidName } from '../utiltis/validation';


export default function Page({ params }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false); // State to track if the user is authorized
  const studentId = localStorage.getItem('student_id'); // Retrieve the student ID from localStorage

  // Authorization check
  useEffect(() => {
    (async () => {
      const userLoggedIn = localStorage.getItem('username'); // Check who is currently logged in
      const resolvedParams = await params; // Resolve dynamic route parameters
      if (userLoggedIn === resolvedParams.ParkingFile) {
        setIsAuthorized(true); // User is authorized if their username matches the ParkingFile
      } else {
        router.push('/'); // Redirect unauthorized users to the homepage
      }
    })();
  }, [params, router]);

  const [isEditing, setIsEditing] = useState(false); // Track if the user is editing an existing form

  const [parkingData, setParkingData] = useState({
    parking_application: {
      first_name: "", 
      last_name: "", 
      email: "", 
      student_id: parseInt(studentId), // Retrieve and parse student ID from localStorage
      phone_number: "", 
      Study_Department: "", 
      car_type: "", 
      car_number: "", 
      license_image: null, 
      is_Won: false 
    }
  });

  // Fetch parking data based on the student ID
  useEffect(() => {
    const fetchParkingData = async () => {
      const studentId = localStorage.getItem('student_id'); // Get student ID from localStorage
      console.log('Current studentId:', studentId);

      if (studentId) {
        try {
          const response = await fetch(`https://bs-fse-2025-team9.onrender.com/documents/${studentId}`);
          if (response.ok) {
            const data = await response.json(); // Parse the server response
            setParkingData({ parking_application: data }); // Populate form fields with existing data
            setIsEditing(true); // Indicate that the user is editing an existing form
          } else {
            console.log('No document found for this student.'); // Log if no form exists
          }
        } catch (err) {
          console.error('Error fetching parking data:', err); // Log any fetch errors
        }
      }
    };

    fetchParkingData(); // Fetch data when the component loads
  }, []);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === 'file') { // Check if the input is a file upload
      const file = files[0];
      if (file) {
        const reader = new FileReader(); // Create a FileReader to handle the file
        reader.onloadend = () => {
          setParkingData(prev => ({
            parking_application: {
              ...prev.parking_application,
              license_image: reader.result // Save the base64-encoded image
            }
          }));
        };
        reader.readAsDataURL(file); // Read the file as a Data URL
      }
    } else {
      setParkingData(prev => ({
        parking_application: {
          ...prev.parking_application,
          [id]: value // Update the corresponding field in the form state
        }
      }));
    }
  };

  // Handle form updates
  const handleUpdate = async () => {
    const studentId = localStorage.getItem('student_id'); // Retrieve student ID from localStorage
    const { parking_application } = parkingData;
    const { isValid: isValidemail, error: emailError } = isValidEmail(parking_application.email);
    if (!isValidemail) {
        alert(emailError);
        return;
    }

    const { isValid: isValidcarnumber, error: carerror  } = isValidcarNumber(parking_application.car_number);
    if (!isValidcarnumber) {
        alert(carerror);
        return;
    }

    const { isValid: isValidphone, error: phoneError } = isValidPhoneNumber(parking_application.phone_number);
    if (!isValidphone) {

        alert(phoneError);
        return;
    }

    const { isValid: isValidname, error: nameError } = isValidName(parking_application.first_name);
    if (!isValidname) {
        alert(nameError);
        return;
    }

    const { isValid: isValidname2, error: nameError2 } = isValidName(parking_application.last_name);
    if (!isValidname2) {
        alert(nameError2);
        return;
    }

    try {
      const response = await fetch(`https://bs-fse-2025-team9.onrender.com/documents/${studentId}`, {
        method: 'PUT', // Use PUT to update existing data
        headers: {
          'Content-Type': 'application/json', // Send JSON data to the server
        },
        body: JSON.stringify(parking_application), // Convert parking data to JSON
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (response.ok) {
          alert('Application updated successfully!'); // Notify the user of success
          localStorage.setItem('parkingData', JSON.stringify(parkingData)); // Save the updated data locally
        } else {
          alert(`Error: ${data.message}`); // Notify the user of errors
        }
      } else {
        const text = await response.text();
        alert(`Unexpected response from server: ${text}`); // Handle unexpected server responses
      }
    } catch (err) {
      console.error('Error updating parking application:', err); // Log update errors
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  // Handle form submission for new applications
  const handleSignUp = async () => {
    const { parking_application } = parkingData;

    // Validate that all required fields are filled
    if (!parking_application.first_name ||
      !parking_application.last_name ||
      !parking_application.student_id ||
      !parking_application.email ||
      !parking_application.phone_number ||
      !parking_application.Study_Department ||
      !parking_application.car_type ||
      !parking_application.car_number) {
      alert("Please fill in all fields!"); // Notify the user if fields are missing
      return;
    }
    const { isValid: isValidemail, error: emailError } = isValidEmail(parking_application.email);
    if (!isValidemail) {
        alert(emailError);
        return;
    }

    const { isValid: isValidcarnumber, error: carerror  } = isValidcarNumber(parking_application.car_number);
    if (!isValidcarnumber) {
        alert(carerror);
        return;
    }

    const { isValid: isValidphone, error: phoneError } = isValidPhoneNumber(parking_application.phone_number);
    if (!isValidphone) {

        alert(phoneError);
        return;
    }

    const { isValid: isValidname, error: nameError } = isValidName(parking_application.first_name);
    if (!isValidname) {
        alert(nameError);
        return;
    }

    const { isValid: isValidname2, error: nameError2 } = isValidName(parking_application.last_name);
    if (!isValidname2) {
        alert(nameError2);
        return;
    }

    if (!parking_application.license_image) {
      alert("Please select a license file!"); // Notify the user if the license file is missing
      return;
    }



    try {
      const response = await fetch('https://bs-fse-2025-team9.onrender.com/documents', {
        method: 'POST', // Use POST to create new data
        headers: {
          'Content-Type': 'application/json', // Send JSON data to the server
        },
        body: JSON.stringify(parkingData) // Convert the data to JSON format
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (response.ok) {
          alert('Application submitted successfully!'); // Notify the user of success
          localStorage.setItem('parkingData', JSON.stringify(parkingData)); // Save the submitted data locally
          window.location.reload();

        } else {
          alert(`Error: ${data.message}`); // Notify the user of server errors
        }
      } else {
        const text = await response.text();
        throw new Error(text); // Handle unexpected responses
      }
    } catch (err) {
      console.error('Error details:', err); // Log submission errors
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  // Conditionally show or hide the student ID input
  const userRole = localStorage.getItem('userRole'); // Get the user's role
  const showStudentIdInput = userRole !== 'false'; // Show the input only if the role is not 'false'

  const [isWon, setIsWon] = useState(localStorage.getItem('is_won') === 'true'); // Track if the user has won parking

  // Check if a form already exists for the student
  useEffect(() => {
    const checkIfFormExists = async () => {
      if (studentId) {
        try {
          const response = await fetch(`https://bs-fse-2025-team9.onrender.com/documents/${studentId}`);
          if (response.ok) {
            const data = await response.json();
            if (data) {
              const isWonFromDB = data.is_won; // Retrieve the is_won value from the database
              localStorage.setItem('is_won', isWonFromDB.toString()); // Save it in localStorage
              setIsWon(isWonFromDB); // Update the state
            }
          } else {
            setIsWon(false); // If no form exists, set isWon to false
            localStorage.setItem('is_won', 'false'); // Save the default value in localStorage
          }
        } catch (err) {
          console.error('Error fetching parking data:', err); // Log errors during fetch
        }
      }
    };

    checkIfFormExists(); // Check if a form exists when the component loads
  }, []);

  // If isWon is still null, show a loading state
  if (isWon === null) {
    return <div>Loading...</div>; // Display a loading message until the data is ready
  }


  return (
    
    <div>
      <NavBar userRole={localStorage.getItem('userRole')} isWon={isWon}>
        {localStorage.getItem('student_id')}
      </NavBar>
      <div className="flex flex-col items-center justify-center p-5 min-h-screen bg-gradient-to-br from-green-300 via-teal-200 to-cyan-300 rtl px-4 sm:px-6">
        <div className="bg-white rounded-2xl box-border min-h-[600px] p-5 w-full sm:w-[520px]">
          <div className="font-sans text-2xl sm:text-4xl font-semibold mt-3 text-center text-green-500">
            Application Form
          </div>

          <div className="relative w-full mt-4">
            <input
              id="first_name"
              value={parkingData.parking_application.first_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
              type="text"
              placeholder="First Name"
            />
          </div>

          <div className="relative w-full mt-4">
            <input
              id="last_name"
              value={parkingData.parking_application.last_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
              type="text"
              placeholder="Last Name"
            />
          </div>

          {showStudentIdInput && (
            <div className="relative w-full mt-4">
              <input
                id="student_id"
                value={parkingData.parking_application.student_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
                type="string"
                placeholder="ID"
              />
            </div>
          )}

          <div className="relative w-full mt-4">
            <input
              id="email"
              value={parkingData.parking_application.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
              type="email"
              placeholder="Email"
            />
          </div>

          <div className="relative w-full mt-4">
            <input
              id="phone_number"
              value={parkingData.parking_application.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
              type="text"
              placeholder="Phone Number"
            />
          </div>

          <div className="relative w-full mt-4">
            <label htmlFor="Study_Department" className="text-lg"></label>
            <select
              id="Study_Department"
              value={parkingData.parking_application.Study_Department}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
            >
              <option value="" disabled>Select your department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>

          <div className="relative w-full mt-4">
            <input
              id="car_type"
              value={parkingData.parking_application.car_type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
              type="text"
              placeholder="Car Type"
            />
          </div>

          <div className="relative w-full mt-4">
            <input
              id="car_number"
              value={parkingData.parking_application.car_number}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
              type="text"
              placeholder="Car Number"
            />
          </div>

          <div className="relative w-full mt-4">
            <input
              id="license_image"
              onChange={handleChange}
              className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
              type="file"
              accept="image/*"
            />
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={isEditing ? handleUpdate : handleSignUp}
              className="mt-7 w-full py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-green-400 shadow-lg transform hover:scale-105 transition-all duration-300 p-4"
            >
              {isEditing ? 'Update Application' : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}