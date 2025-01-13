"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../../components/NavBar";

export default function EditUser({ params }) {
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [parkingFile, setParkingFile] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [parkingData, setParkingData] = useState({
        parking_application: {
            first_name: "",
            last_name: "",
            email: "",
            student_id: parseInt(localStorage.getItem("student_id"), 10),
            phone_number: "",
            Study_Department: "",
            car_type: "",
            car_number: "",
            license_image: null,
            is_Won: false,
        },
    });

    // Resolve params and set userId and ParkingFile
    useEffect(() => {
        (async () => {
            const resolvedParams = await params;
            setUserId(resolvedParams.userId);
            setParkingFile(resolvedParams.ParkingFile);
        })();
    }, [params]);

    // Fetch user data from the API
    const fetchUser = async () => {
        if (!userId) return;

        try {
            const response = await fetch(`https://bs-fse-2025-team9.onrender.com/documents/${userId}`);
            if (!response.ok) throw new Error("Document not found");
            const data = await response.json();
            setParkingData((prev) => ({
                parking_application: {
                    ...prev.parking_application,
                    ...data,
                },
            }));
        } catch (error) {
            console.error("Error fetching user:", error);
            setErrorMessage("Failed to load user data.");
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setParkingData((prev) => ({
            parking_application: {
                ...prev.parking_application,
                [name]: type === "checkbox" ? checked : files ? files[0] : value,
            },
        }));
    };

    // Save updated user data to the backend
    const handleSave = async () => {
        try {
            const response = await fetch(`https://bs-fse-2025-team9.onrender.com/documents/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parkingData.parking_application),
            });

            if (!response.ok) throw new Error("Failed to save data");

            alert("Document updated successfully!");
            await fetchUser();
            router.push(`/${parkingFile}/search`);
        } catch (error) {
            console.error("Error saving data:", error);
            setErrorMessage("Failed to save changes.");
        }
    };

    return (
        <div>
            <NavBar userRole={localStorage.getItem("userRole")}>
                {localStorage.getItem("studentId")}
            </NavBar>
            <div className="min-h-screen bg-gradient-to-br from-green-300 via-teal-200 to-cyan-300 flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 space-y-6 animate-fade-in">
                    <h1 className="text-4xl font-extrabold text-center text-cyan-700 tracking-wide">
                        Edit Document
                    </h1>
                    {errorMessage && (
                        <p className="text-red-600 bg-red-100 border-l-4 border-red-500 p-4 rounded-md text-center shadow-md">
                            {errorMessage}
                        </p>
                    )}
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="first_name" className="block text-lg font-semibold text-gray-700">
                                    First Name
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    value={parkingData.parking_application.first_name || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-lg font-semibold text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    value={parkingData.parking_application.last_name || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="student_id" className="block text-lg font-semibold text-gray-700">
                                    Student ID
                                </label>
                                <input
                                    id="student_id"
                                    name="student_id"
                                    value={parkingData.parking_application.student_id || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    value={parkingData.parking_application.email || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="phone_number" className="block text-lg font-semibold text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    value={parkingData.parking_application.phone_number || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="Study_Department" className="block text-lg font-semibold text-gray-700">
                                    Study Department
                                </label>
                                <select
                                    id="Study_Department"
                                    name="Study_Department"
                                    value={parkingData.parking_application.Study_Department || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400"
                                >
                                    <option value="">Select your department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Software Engineering">Software Engineering</option>
                                    <option value="Business Administration">Business Administration</option>
                                    <option value="Chemistry">Chemistry</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="car_type" className="block text-lg font-semibold text-gray-700">
                                    Car Type
                                </label>
                                <input
                                    id="car_type"
                                    name="car_type"
                                    value={parkingData.parking_application.car_type || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="car_number" className="block text-lg font-semibold text-gray-700">
                                    Car Number
                                </label>
                                <input
                                    id="car_number"
                                    name="car_number"
                                    value={parkingData.parking_application.car_number || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="license_image" className="block text-lg font-semibold text-gray-700">
                                Driver's License
                            </label>
                            <input
                                id="license_image"
                                name="license_image"
                                type="file"
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="is_Won" className="block text-lg font-semibold text-gray-700">
                                Won Parking Slot
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="w-full py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}