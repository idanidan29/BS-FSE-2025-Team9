"use client"; // Indicates that this file is a client-side component in Next.js

import { FaPencil } from "react-icons/fa6"; // Pencil icon for the edit action
import { FaTrash } from "react-icons/fa"; // Trash icon for the delete action
import { useState, useEffect } from "react"; // React hooks for state and lifecycle management
import { FaCrown } from "react-icons/fa"; // Crown icon for the promote action
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io"; // Dropdown icons
import { useRouter } from "next/navigation"; // Next.js hook for client-side navigation
import NavBar from "../../components/NavBar"; // NavBar component for page header

export default function Page() {
    const [users, setUsers] = useState([]); // State to store the list of users
    const [searchId, setSearchId] = useState(""); // State for the search input value
    const [filteredUser, setFilteredUser] = useState(null); // State to store a filtered user from the search
    const [isSearchPerformed, setIsSearchPerformed] = useState(false); // Tracks whether a search was performed
    const [dropdownOpen, setDropdownOpen] = useState(null); // Tracks which user's dropdown menu is open
    const router = useRouter(); // For client-side navigation

    // Fetches the list of users from the API when the component mounts
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("https://bs-fse-2025-team9.onrender.com/users"); // API endpoint for users
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data); // Store fetched users in state
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers(); // Call fetchUsers on component mount
    }, []);

    // Filters a user by their student ID
    const handleSearch = () => {
        const user = users.find((user) => String(user.student_id) === String(searchId)); // Match user by ID
        setFilteredUser(user || null); // Update filtered user state
        setIsSearchPerformed(true); // Mark that a search has been performed
    };

    // Deletes a user by their ID
    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`https://bs-fse-2025-team9.onrender.com/users/${userId}`, {
                method: "DELETE", // API DELETE request
            });
            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            setUsers((prevUsers) => prevUsers.filter((user) => user.student_id !== userId)); // Remove user from state
            if (filteredUser && filteredUser.student_id === userId) {
                setFilteredUser(null); // Clear filtered user if deleted
            }
            setDropdownOpen(null); // Close dropdown menu
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // Redirects to the edit page for a specific user
    const handleEdit = (userId) => {
        const username = localStorage.getItem("username"); // Get username from localStorage
        const sanitizedUsername = username.endsWith("/") ? username.slice(0, -1) : username; // Remove trailing slash
        router.push(`/${sanitizedUsername}/search/${userId}`); // Navigate to user edit page
        setDropdownOpen(null); // Close dropdown menu
    };

    // Promotes a user to admin by updating their role in the database
    const handlePromoteToAdmin = async (username) => {
        try {
            const response = await fetch(`https://bs-fse-2025-team9.onrender.com/users/${username}`, {
                method: "PUT", // API PUT request
                headers: {
                    "Content-Type": "application/json", // Indicate JSON content
                },
                body: JSON.stringify({ is_admin: true }), // Payload to update user role
            });

            if (!response.ok) {
                throw new Error("Failed to promote user to admin");
            }

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.username === username ? { ...user, is_admin: true } : user // Update state for promoted user
                )
            );

            if (filteredUser && filteredUser.username === username) {
                setFilteredUser({ ...filteredUser, is_admin: true }); // Update filtered user state
            }

            alert(`User ${username} has been successfully promoted to admin.`); // Success message
            setDropdownOpen(null); // Close dropdown menu
        } catch (error) {
            console.error("Error promoting user to admin:", error);
            alert(`Failed to promote user ${username} to admin. Please try again.`); // Error message
        }
    };

    // Toggles the visibility of the dropdown menu for a user
    const handleDropdownToggle = (userId) => {
        setDropdownOpen(dropdownOpen === userId ? null : userId); // Toggle dropdown state
    };

    // Determines which users to display (filtered or all)
    const displayedUsers = isSearchPerformed && filteredUser ? [filteredUser] : users;

    // Render the page
    return (
        <div>
            <NavBar userRole={localStorage.getItem('userRole')}> {/* NavBar with user role */}
                {localStorage.getItem('studentId')}
            </NavBar>
            <div className="w-full min-h-screen bg-gradient-to-br from-green-300 via-teal-200 to-cyan-300 flex items-center justify-center p-4 sm:p-8 w-full space-y-2 animate-fade-in">

            </div>
        </div>
    );
}
