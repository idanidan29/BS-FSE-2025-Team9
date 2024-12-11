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
            const response = await fetch(`http://localhost:5000/users/${username}`);
    
            if (response.ok) {
                const data = await response.json();
    
                if (data) {
                    if (data.password === password) {
                        router.push(`/${username}`); //direct to next page
                    } else {
                        alert("Incorrect password. Please try again.");
                    }
                } else {
                    alert("User does not exist. Please sign up.");
                }
            } else {
                alert("Failed to connect to the server. Please try again later.");
            }
        } catch (err) {
            alert("An unexpected error occurred. Please try again.");
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
                    Sign In
                </div>

                <div className="relative w-full mt-10">
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

                <button
                    onClick={handleCheckUser}
                    className="bg-green-500 rounded-full border-0 text-[#eee] text-lg h-[50px] mt-9 w-full hover:bg-green-600"
                >
                    Login
                </button>
                <button
                    onClick={Navigation}
                    className="bg-[#fff] text-green-500 rounded-full border border-green-500 text-lg h-[50px] mt-9 w-full hover:bg-green-500 hover:text-white"
                >
                    I Don’t Have A User
                </button>
            </div>
        </div>
    );
}
