"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();

    const Navigation = () => {
        router.push("/");
    };

    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        student_id: "",
        is_admin: "",
    });

    const [emailError, setEmailError] = useState("");

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
            const response = await fetch("https://bs-fse-2025-team9.onrender.com/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, first_name, last_name, email, password, student_id }),
            });

            if (response.ok) {
                alert("Sign-up successful!");
                router.push("/");
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            alert("An unexpected error occurred. Please try again later.");
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
                    Sign Up
                </div>

                {["first_name", "last_name", "student_id", "username", "password", "email"].map((field, index) => (
                    <div key={field} className={`relative w-full mt-${index === 0 ? 8 : 5}`}>
                        <input
                            id={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="bg-white h-[50px] sm:h-[70px] rounded-xl border border-green-500 text-gray-800 text-lg outline-none px-4 sm:px-5 w-full"
                            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                            placeholder={field.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                        />
                        {field === "email" && emailError && (
                            <div className="text-red-500 text-sm mt-2">{emailError}</div>
                        )}
                    </div>
                ))}

                <button
                    onClick={handleSignUp}
                    className="bg-green-500 rounded-full border-0 text-white text-lg h-[45px] sm:h-[50px] mt-7 w-full hover:bg-green-600"
                >
                    Sign Up
                </button>
                <button
                    onClick={Navigation}
                    className="bg-white text-green-500 rounded-full border border-green-500 text-lg h-[45px] sm:h-[50px] mt-5 sm:mt-7 w-full hover:bg-green-500 hover:text-white"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
