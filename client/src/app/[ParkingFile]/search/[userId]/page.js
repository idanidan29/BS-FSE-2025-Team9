"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditUser({ params }) {
    const router = useRouter();
    const { userId } = params; // Get userId from route params

    const [userData, setUserData] = useState(null); // State to store user data
    const [errorMessage, setErrorMessage] = useState(""); // State for errors

    useEffect(() => {
        if (!userId) return;

        // Fetch user data by userId
        async function fetchUser() {
            try {
                const response = await fetch(`http://localhost:5000/documents/${userId}`); // API endpoint for fetching user
                if (!response.ok) throw new Error("User not found");
                const data = await response.json();
                setUserData(data); // Set user data
            } catch (error) {
                console.error("Error fetching user:", error);
                setErrorMessage("Failed to load user data.");
            }
        }

        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target; // Get name and value from input
        setUserData((prev) => ({ ...prev, [name]: value })); // Update state
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/documents/${userId}`, {
                method: "PUT", // PUT method to update user data
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (!response.ok) throw new Error("Failed to save user data");

            alert("User updated successfully!");
            router.push(`/${params.ParkingFile}/search`); // Redirect to search page
        } catch (error) {
            console.error("Error saving user data:", error);
            setErrorMessage("Failed to save changes.");
        }
    };

    //if (!userData) return <div>Loading...</div>;

    return (
        <div>
            <h1>Edit User</h1>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <form>
                <label>First Name:</label>
                <input
                    name="first_name"
                    value={userData.first_name || ""}
                    onChange={handleChange}
                />
                <label>Last Name:</label>
                <input
                    name="last_name"
                    value={userData.last_name || ""}
                    onChange={handleChange}
                />
                <label>Car Number:</label>
                <input
                    name="car_number"
                    value={userData.car_number || ""}
                    onChange={handleChange}
                />
                <button type="button" onClick={handleSave}>
                    Save
                </button>
            </form>
        </div>
    );
}
