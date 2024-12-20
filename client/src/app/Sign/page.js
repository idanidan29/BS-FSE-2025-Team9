"use client";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function page() {
    const router = useRouter();

    const Navigation = () => {
        router.push('/');
    }
    
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        student_id: '',
        is_admin: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSignUp = async () => {
        const { username, first_name, last_name, email, password, student_id } = formData;

        if (!first_name || !last_name || !student_id || !username || !password || !email) {
            alert("Please fill in all fields!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, first_name, last_name, email, password, student_id }),
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
        <div className="flex flex-col items-center justify-center h-screen bg-[#fff]">
            <div className="mb-10"> 
                <Image
                    src="/SCE_logo.png" 
                    alt="Logo"
                    width={350}  
                    height={350} 
                    className="h-auto w-auto"  
                />
            </div>

            <div className="bg-[#fff] rounded-2xl box-border h-[450px] p-5 w-[520px]">
                <div className="text-[#eee] font-sans text-4xl font-semibold mt-8 text-center text-green-500">
                    Sign Up
                </div>

                <div className="relative w-full mt-7">
                    <input
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="bg-[#fff] h-[70px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="First Name"
                    />
                </div>

                <div className="relative w-full mt-7">
                    <input
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="bg-[#fff] h-[70px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="Last Name"
                    />
                </div>

                <div className="relative w-full mt-7">
                    <input
                        id="student_id"
                        value={formData.student_id}
                        onChange={handleChange}
                        className="bg-[#fff] h-[70px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="ID"
                    />
                </div>

                <div className="relative w-full mt-7">
                    <input
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="bg-[#fff] h-[70px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="User Name"
                    />
                </div>

                <div className="relative w-full mt-7">
                    <input
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-[#fff] h-[70px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="password"
                        placeholder="Password"
                    />
                </div>

                <div className="relative w-full mt-7">
                    <input
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-[#fff] h-[70px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="email"
                        placeholder="Email"
                    />
                </div>

                <button onClick={handleSignUp} className="bg-green-500 rounded-full border-0 text-[#eee] text-lg h-[50px] mt-9 w-full hover:bg-green-600">
                    Sign Up
                </button>
                <button onClick={Navigation} className="bg-[#fff] text-green-500 rounded-full border border-green-500 text-lg h-[50px] mt-9 w-full hover:bg-green-500 hover:text-white">
                    Login
                </button>
            </div>
        </div>
    );
}
