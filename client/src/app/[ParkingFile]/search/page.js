"use client";
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Navbar from "@/app/components/NavBar";

export default function Page() {
    const [users, setUsers] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [filteredUser, setFilteredUser] = useState(null);
    const [isSearchPerformed, setIsSearchPerformed] = useState(false); // To track search action
    const router = useRouter(); // Instantiate the router for navigation

    useEffect(() => {
        // Fetch users from the server
        async function fetchUsers() {
            try {
                const response = await fetch("http://localhost:5000/users"); // Update the URL to your API endpoint
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers();
    }, []);

    const handleSearch = () => {
        const user = users.find((user) => String(user.student_id) === String(searchId));
        setFilteredUser(user || null); // Set filtered user (or null if not found)
        setIsSearchPerformed(true); // Mark that search was performed
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: "DELETE", // Make a DELETE request
            });
            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            // Remove the user from the local state
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            if (filteredUser && filteredUser._id === userId) {
                setFilteredUser(null); // Reset filtered user if it's the one deleted
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleEdit = async (userId) => {
        try {
            // Check if a document exists for the given user ID
            const response = await fetch(`http://localhost:5000/documents/${userId}`); // Assuming the endpoint for documents
            if (!response.ok) {
                throw new Error("Document not found");
            }
            const data = await response.json();
            if (data) {
                // If document exists, redirect to the edit page
                router.push(`/edit-document/${userId}`); // Redirect to a page where you can edit the document
            }
        } catch (error) {
            console.error("Error checking document:", error);
            alert("No document found for this user.");
        }
    };

    const displayedUsers = isSearchPerformed && filteredUser ? [filteredUser] : users;

    return (
        <div>
            <Navbar />
            <div>
                <div className="flex flex-col items-center space-y-4">
                    <label htmlFor="searchById" className="text-lg font-medium">
                        Search User by ID:
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            id="searchById"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Enter user ID"
                            className="w-64 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Table showing users */}
                <div className="flex flex-col w-full px-10 lg:px-20 mt-10">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full py-4">
                            <div className="overflow-hidden border border-gray-300 rounded-lg shadow-md">
                                <table className="w-full text-left text-lg font-light">
                                    <thead className="bg-gray-200 border-b font-medium text-base">
                                        <tr>
                                            <th scope="col" className="px-8 py-6">Number</th>
                                            <th scope="col" className="px-8 py-6">First Name</th>
                                            <th scope="col" className="px-8 py-6">Last Name</th>
                                            <th scope="col" className="px-8 py-6">Student ID</th>
                                            <th scope="col" className="px-8 py-6">Email</th>
                                            <th scope="col" className="px-8 py-6">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedUsers.length > 0 ? (
                                            displayedUsers.map((user, index) => (
                                                <tr
                                                    key={user._id}
                                                    className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
                                                >
                                                    <td className="whitespace-nowrap px-8 py-6 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-6">
                                                        {user.first_name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-6">
                                                        {user.last_name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-6">
                                                        {user.student_id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-6">
                                                        {user.email}
                                                    </td>
                                                    <td className="whitespace-nowrap px-8 py-6">
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            className="px-4 py-2 bg-[#a5a6aa] text-white rounded-md hover:bg-red-600 transition mr-2"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(user.student_id)} // Pass the student_id to check the document
                                                            className="px-4 py-2 bg-[#a5a6aa] text-white rounded-md hover:bg-yellow-500 transition"
                                                        >
                                                            <FaPencil />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="text-center py-6 text-gray-500"
                                                >
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
