"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


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

                const data = await response.json();
                localStorage.setItem('student_id', data.student_id);
                alert('Sign-up successful!');
                router.push('/');  

            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            alert("An unexpected error occurred. Please try again later.");
        }
    };
    useEffect(() => {
        // טען את הנתונים מה-localStorage
        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }

        // פונקציה להעלאת המסמך מהשרת
        const fetchData = async () => {
            const studentId = localStorage.getItem('studentId');
            if (studentId) {
                try {
                    const response = await fetch(`https://bs-fse-2025-team9.onrender.com/documents/${studentId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setParkingData({ document: data });
                    } else {
                        console.log('No document found.');
                    }
                } catch (err) {
                    console.error('Error fetching document:', err);
                }
            }
        };

        fetchData();
    }, []); // הפעיל את ה-useEffect פעם אחת כשקומפוננטה נטענת

    // שימוש ב-useEffect נוסף כדי לשמור את formData ב-localStorage בכל פעם שהוא משתנה
    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [formData]); // הפעיל את ה-useEffect כאשר formData משתנה

      
    

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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
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
                    className="mt-7 w-full py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-green-400 shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    Sign Up
                </button>
                <button
                    onClick={Navigation}
                    className="mt-7 w-full py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-green-400 shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    Login
                </button>
            </div>
        </div>
    );

}

