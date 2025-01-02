"use client";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const router = useRouter();

    const Navigation = () => {
        router.push('/Sign');
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleCheckUser = async () => {
        const { username, password } = formData;
    
        // Validate input
        if (!username || !password) {
            alert("Please fill in both fields!");
            return;
        }
    
        try {
            const response = await fetch("https://bs-fse-2025-team9.onrender.com/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
        
            if (response.ok) {
                const data = await response.json();
        
                if (data) {
                    // Store the username in localStorage or context
                    localStorage.setItem("username", username);
                    localStorage.setItem("studentId", data.student_id);
                    localStorage.setItem("userRole", data.is_admin);
        
                    // Direct to the user's page after successful login
                    router.push(`/${username}`);
                } else {
                    alert("User does not exist. Please sign up.");
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to connect to the server. Please try again later.");
            }
        } catch (err) {
            alert("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-0 bg-gradient-to-br from-green-300 via-teal-200 to-cyan-300">
            <div className="mb-5 sm:mb-10 w-full flex justify-center">
                <Image
                    src="/SCE_logo.png"
                    alt="Logo"
                    width={200}
                    height={200}
                    className="h-auto w-auto"
                />
            </div>
    
            <div className="bg-white rounded-2xl box-border p-5 w-full max-w-[400px] sm:max-w-[520px] shadow-md">
                <div className="text-gray-800 font-sans text-2xl sm:text-4xl font-semibold mt-5 sm:mt-8 text-center text-green-500">
                    Sign In
                </div>
    
                <div className="relative w-full mt-8">
                    <input
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="bg-white h-[50px] sm:h-[70px] rounded-xl border border-green-500 text-gray-800 text-lg outline-none px-4 sm:px-5 pt-1 w-full"
                        type="text"
                        placeholder="User Name"
                    />
                </div>
    
                <div className="relative w-full mt-5 sm:mt-7">
                    <input
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-white h-[50px] sm:h-[70px] rounded-xl border border-green-500 text-gray-800 text-lg outline-none px-4 sm:px-5 pt-1 w-full"
                        type="password"
                        placeholder="Password"
                    />
                </div>
    
                <button
                    onClick={handleCheckUser}
                    className="mt-7 w-full py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-green-400 shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    Login
                </button>
                <button
                    onClick={Navigation}
                    className="mt-7 w-full py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-green-400 shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    I Dont Have A User
                </button>
            </div>
        </div>
    );
}
