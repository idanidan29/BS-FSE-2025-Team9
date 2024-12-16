"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page({ params }) {

  const router = useRouter();

    const Navigation = () => {
        router.push('/');
    }
   
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        idNumber: '',
        email: '',
        phone: '',
        department: '',
        carType: '',
        carNumber: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSignUp = async () => {
        const { firstName, lastName,email, idNumber, phone, department, carType, carNumber } = formData;

        // Validation check
        if (!firstName || !lastName || !idNumber || !email || !phone || !department || !carType || !carNumber) {
            alert("Please fill in all fields!");
            return;
        }

        try {
            const response = await fetch('localhost:5000/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Sending the entire form data object
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Sign-up successful!');
                router.push('/');  
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#fff] rtl">
<div className="bg-[#fff] rounded-2xl box-border min-h-[600px] p-5 w-[520px]">
<div className="text-[#eee] font-sans text-4xl font-semibold mt-8 text-center text-green-500">
                   Application Form 
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="First Name"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="Last name"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="ID"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="email"
                        placeholder="Email"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="tel"
                        placeholder="Phone Number"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="Department"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="carType"
                        value={formData.carType}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="Car Type"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="carNumber"
                        value={formData.carNumber}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="Car Number"
                    />
                </div>
                <div className="relative w-full mt-4">
                <label htmlFor="driversLicense" className="text-lg">Driver's License:</label>
                    <input
                        id="driversLicense"
                        
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="file"
                        placeholder="Driver's License"
                    />
                </div>

                <button onClick={handleSignUp} className="bg-green-500 rounded-full border-0 text-[#eee] text-lg h-[50px] mt-9 w-full hover:bg-green-600">
                    Send
                </button>
                <button onClick={Navigation} className="bg-[#fff] text-green-500 rounded-full border border-green-500 text-lg h-[50px] mt-5 w-full hover:bg-green-500 hover:text-white">
                    back
                </button>
            </div>
        </div>
    );
}
