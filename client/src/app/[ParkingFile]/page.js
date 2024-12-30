"use client";
import NavBar from '../components/NavBar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Page({ params }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // מצב לעריכת טופס
  const [parkingData, setParkingData] = useState({
    parking_application: {
      first_name: "",
      last_name: "",
      email: "",
      student_id: "",
      phone_number: "",
      Study_Department: "",
      car_type: "",
      car_number: "",
      license_image: null // Will store base64 string
    }
  });

  // Authorization check
  useEffect(() => {
    (async () => {
      const userLoggedIn = localStorage.getItem('username');
      const resolvedParams = await params;
      if (userLoggedIn === resolvedParams.ParkingFile) {
        setIsAuthorized(true);
      } else {
        router.push('/');
      }
    })();
  }, [params, router]);

  // Load parking data from the server based on student_id
  useEffect(() => {
    const fetchParkingData = async () => {
      const studentId = localStorage.getItem('studentId');
      console.log('Current studentId:', studentId);

      if (studentId) {
        try {
          const response = await fetch(`http://localhost:5000/documents/${studentId}`);
          if (response.ok) {
            const data = await response.json();
            setParkingData({ parking_application: data });
            setIsEditing(true); // נכנסים למצב עריכה אם נתונים טוענים בהצלחה
          } else {
            console.log('No document found for this student.');
          }
        } catch (err) {
          console.error('Error fetching parking data:', err);
        }
      }
    };

    fetchParkingData();
  }, []); // השאר את התלות ריקה כדי שזה יקרה פעם אחת כשמטעינים את הקומפוננטה


  const Navigation = () => {
    router.push('/');
  };

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setParkingData(prev => ({
            parking_application: {
              ...prev.parking_application,
              license_image: reader.result // This will be base64 string
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setParkingData(prev => ({
        parking_application: {
          ...prev.parking_application,
          [id]: value
        }
      }));
    }
  };

  const handleUpdate = async () => {
    const studentId = localStorage.getItem('studentId');
    const { parking_application } = parkingData;

    try {
      const response = await fetch(`http://localhost:5000/documents/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parking_application),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (response.ok) {
          alert('Application updated successfully!');
          localStorage.setItem('parkingData', JSON.stringify(parkingData)); // Save updated data
        } else {
          alert(`Error: ${data.message}`);
        }
      } else {
        const text = await response.text();
        alert(`Unexpected response from server: ${text}`);
      }
    } catch (err) {
      console.error('Error updating parking application:', err);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const handleSignUp = async () => {
    const { parking_application } = parkingData;

    if (!parking_application.first_name ||
      !parking_application.last_name ||
      !parking_application.student_id ||
      !parking_application.email ||
      !parking_application.phone_number ||
      !parking_application.Study_Department ||
      !parking_application.car_type ||
      !parking_application.car_number) {
      alert("Please fill in all fields!");
      return;
    }

    if (!parking_application.license_image) {
      alert("Please select a license file!");
      return;
    }

    try {
      console.log('Sending data:', JSON.stringify(parkingData));

      const response = await fetch('http://localhost:5000/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parkingData)
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (response.ok) {
          alert('Application submitted successfully!');
          localStorage.setItem('parkingData', JSON.stringify(parkingData)); // Save submitted data
          router.push('/');
        } else {
          alert(`Error: ${data.message}`);
        }
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    } catch (err) {
      console.error('Error details:', err);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#fff] rtl">
      <NavBar userRole={localStorage.getItem('userRole')}>
        {localStorage.getItem('studentId')}
      </NavBar>
      <div className="bg-[#fff] rounded-2xl box-border min-h-[600px] p-5 w-[520px]">
        <div className="text-[#eee] font-sans text-4xl font-semibold mt-8 text-center text-green-500">
          Application Form
        </div>

        <div className="relative w-full mt-4">
          <input
            id="first_name"
            value={parkingData.parking_application.first_name}
            onChange={handleChange}
            className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
            type="text"
            placeholder="First Name"
          />
        </div>

        <div className="relative w-full mt-4">
          <input
            id="last_name"
            value={parkingData.parking_application.last_name}
            onChange={handleChange}
            className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
            type="text"
            placeholder="Last Name"
          />
        </div>

        <div className="relative w-full mt-4">
          <input
            id="student_id"
            value={parkingData.parking_application.student_id}
            onChange={handleChange}
            className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
            type="text"
            placeholder="ID"
          />
        </div>

        <div className="relative w-full mt-4">
          <input
            id="email"
            value={parkingData.parking_application.email}
            onChange={handleChange}
            className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
            type="email"
            placeholder="Email"
          />
        </div>

        <div className="relative w-full mt-4">
          <input
            id="phone_number"
            value={parkingData.parking_application.phone_number}
            onChange={handleChange}
            className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
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
            className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
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
            className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
            type="text"
            placeholder="Car Type"
          />
        </div>

        <div className="relative w-full mt-4">
          <input
            id="car_number"
            value={parkingData.parking_application.car_number}
            onChange={handleChange}
            className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
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
            className="bg-green-500 text-white rounded-lg h-[50px] w-[200px]"
          >
            {isEditing ? 'Update Application' : 'Submit Application'}
          </button>
          <button
            onClick={Navigation}
            className="bg-red-500 text-white rounded-lg h-[50px] w-[200px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
