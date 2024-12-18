"use client";
import NavBar from '../components/NavBar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page({ params }) {

    const router = useRouter();

    const Navigation = () => {
        router.push('/');
    }

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        student_id: '',
        phone_number: '',
        Study_Department: '',
        car_type: '',
        car_number: ''
    });

    const isValidId = (id) => {
        id = id.replace(/\D/g, '');
        if (id.length !== 9) {
            return false; // Invalid ID length
        }

        const digits = id.split('').map(Number);
        const checksum = digits.reduce((sum, digit, index) => {
            if (index % 2 === 1) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            return sum + digit;
        }, 0);

        return checksum % 10 === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSignUp = async () => {
        const { first_name, last_name, email, student_id, phone_number, Study_Department, car_type, car_number } = {
            ...formData,
            student_id: Number(formData.student_id),   
            phone_number: Number(formData.phone_number), 
            car_number: Number(formData.car_number)  
        };



        // Validation check
        if (!first_name || !last_name || !student_id || !email || !phone_number || !Study_Department || !car_type || !car_number) {
            alert("Please fill in all fields!");
            return;
        }
        const carNumberLength = car_number.length;

        if (carNumberLength !== 7 && carNumberLength !== 8) {
            alert("Car Number must be exactly 7 or 8 digits!");
            return;
        }
        if (!isValidId(student_id)) {
            alert("ID NOT VALID!");
            return;
        }


        try {
            const response = await fetch('http://localhost:5000/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Sending the entire form data object
                body: JSON.stringify({ first_name, last_name, email, student_id, phone_number, Study_Department, car_type, car_number }),
            });

            if (response.ok) {
                alert('document uplouded successful!');
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
            <NavBar />
            <div className="bg-[#fff] rounded-2xl box-border min-h-[600px] p-5 w-[520px]">
                <div className="text-[#eee] font-sans text-4xl font-semibold mt-8 text-center text-green-500">
                    Application Form
                </div>


                <div className="relative w-full mt-4">
                    <input
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="First Name"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="Last name"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="student_id"
                        value={formData.student_id}
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
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="Phone Number"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="Study_Department"
                        value={formData.Study_Department}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="Department"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="car_type"
                        value={formData.car_type}
                        onChange={handleChange}
                        className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="Car Type"
                    />
                </div>

                <div className="relative w-full mt-4">
                    <input
                        id="car_number"
                        value={formData.car_number}
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


