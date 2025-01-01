"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditUser({ params }) {
    const router = useRouter();
    const [userId, setUserId] = useState(null); // State to hold userId from params
    const [parkingFile, setParkingFile] = useState(""); // State to hold ParkingFile from params
    const [userData, setUserData] = useState(null); // State to hold user data
    const [errorMessage, setErrorMessage] = useState(""); // State to display error messages

    // Resolve params and set userId and ParkingFile
    useEffect(() => {
        (async () => {
            const resolvedParams = await params; // Resolve params (in case it's a Promise)
            setUserId(resolvedParams.userId); // Extract and store the userId
            setParkingFile(resolvedParams.ParkingFile); // Extract and store the ParkingFile
        })();
    }, [params]);

    // Fetch user data when userId is available
    useEffect(() => {
        if (!userId) return;

        async function fetchUser() {
            try {
                // API call to fetch user data
                const response = await fetch(`http://localhost:5000/documents/${userId}`);
                if (!response.ok) throw new Error("User not found");
                const data = await response.json();
                setUserData(data); // Update state with user data
            } catch (error) {
                console.error("Error fetching user:", error);
                setErrorMessage("Failed to load user data."); // Set error message on failure
            }
        }

        fetchUser();
    }, [userId]);

    // Handle input change for both text fields and file inputs
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value, // If the input is a file, store the file object
        }));
    };

    // Handle form submission to save user data
    const handleSave = async () => {
        try {
            const formData = new FormData(); // Initialize FormData for file uploads
            for (const key in userData) {
                formData.append(key, userData[key]); // Append all user data to FormData
            }

            // API call to update user data
            const response = await fetch(`https://bs-fse-2025-team9.onrender.com/documents/${userId}`, {
                method: "PUT",
                body: formData, // Send form data (includes files)
            });

            if (!response.ok) throw new Error("Failed to save user data");

            alert("User updated successfully!"); // Notify success
            router.push(`/${parkingFile}/search`); // Navigate back to the search page using ParkingFile
        } catch (error) {
            console.error("Error saving user data:", error);
            setErrorMessage("Failed to save changes."); // Set error message on failure
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-300 via-teal-200 to-cyan-300 flex items-center justify-center p-8">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 space-y-6 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-center text-cyan-700 tracking-wide">
                    Edit User
                </h1>
                {errorMessage && (
                    <p className="text-red-600 bg-red-100 border-l-4 border-red-500 p-4 rounded-md text-center shadow-md">
                        {errorMessage}
                    </p>
                )}
                <form className="space-y-6">
                    {/* Row for First Name and Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="first_name" className="block text-lg font-semibold text-gray-700">
                                First Name
                            </label>
                            <input
                                id="first_name"
                                name="first_name"
                                value={userData?.first_name || ""} // Bind value to state
                                onChange={handleChange} // Handle input change
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block text-lg font-semibold text-gray-700">
                                Last Name
                            </label>
                            <input
                                id="last_name"
                                name="last_name"
                                value={userData?.last_name || ""} // Bind value to state
                                onChange={handleChange} // Handle input change
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Row for Student ID and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="student_id" className="block text-lg font-semibold text-gray-700">
                                Student ID
                            </label>
                            <input
                                id="student_id"
                                name="student_id"
                                value={userData?.student_id || ""} // Bind value to state
                                onChange={handleChange} // Handle input change
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                value={userData?.email || ""} // Bind value to state
                                onChange={handleChange} // Handle input change
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Row for Phone Number and Study Department */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone_number" className="block text-lg font-semibold text-gray-700">
                                Phone Number
                            </label>
                            <input
                                id="phone_number"
                                name="phone_number"
                                value={userData?.phone_number || ""} // Bind value to state
                                onChange={handleChange} // Handle input change
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
                            />
                        </div>
                        <div>
                            <label htmlFor="Study_Department" className="block text-lg font-semibold text-gray-700">
                                Study Department
                            </label>
                            <select
                                id="Study_Department"
                                name="Study_Department"
                                value={userData?.Study_Department || ""} // Bind value to state
                                onChange={handleChange} // Handle input change
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
                            >
                                <option value="">Select your department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Software Engineering">Software Engineering</option>
                                <option value="Business Administration">Business Administration</option>
                                <option value="Chemistry">Chemistry</option>
                            </select>
                        </div>
                    </div>

                    {/* Row for Car Type and Car Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="car_type" className="block text-lg font-semibold text-gray-700">
                                Car Type
                            </label>
                            <input
                                id="car_type"
                                name="car_type"
                                value={userData?.car_type || ""} // Bind value to state
                                onChange={handleChange} // Handle input change
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
                            />
                        </div>
                        <div>
                            <label htmlFor="car_number" className="block text-lg font-semibold text-gray-700">
                                Car Number
                            </label>
                            <input
                                id="car_number"
                                name="car_number"
                                value={userData?.car_number || ""} // Bind value to state
                                onChange={handleChange} // Handle input change
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Drivers License */}
                    <div className="grid grid-cols-1">
                        <div>
                            <label htmlFor="drivers_license" className="block text-lg font-semibold text-gray-700">
                                Drivers License
                            </label>
                            <input
                                id="drivers_license"
                                name="drivers_license"
                                type="file"
                                onChange={(e) => handleChange({ name: "drivers_license", value: e.target.files[0] })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 focus:outline-none shadow transition duration-300 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-full py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-green-400 shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
