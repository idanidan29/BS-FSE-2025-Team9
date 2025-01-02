"use client";
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FaCrown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";

export default function Page() {
    const [users, setUsers] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [filteredUser, setFilteredUser] = useState(null);
    const [isSearchPerformed, setIsSearchPerformed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("https://bs-fse-2025-team9.onrender.com/users");
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
        setFilteredUser(user || null);
        setIsSearchPerformed(true);
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`https://bs-fse-2025-team9.onrender.com/users/${userId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            setUsers((prevUsers) => prevUsers.filter((user) => user.student_id !== userId));
            if (filteredUser && filteredUser.student_id === userId) {
                setFilteredUser(null);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleEdit = (userId) => {
        const username = localStorage.getItem("username");
        const sanitizedUsername = username.endsWith("/") ? username.slice(0, -1) : username; // Remove trailing slash if exists
        router.push(`/${sanitizedUsername}/search/${userId}`);
    };

    const handlePromoteToAdmin = async (username) => {
        try {
            const response = await fetch(`https://bs-fse-2025-team9.onrender.com/users/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ is_admin: true }),
            });

            if (!response.ok) {
                throw new Error("Failed to promote user to admin");
            }

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.username === username ? { ...user, is_admin: true } : user
                )
            );

            if (filteredUser && filteredUser.username === username) {
                setFilteredUser({ ...filteredUser, is_admin: true });
            }

            alert(`User ${username} has been successfully promoted to admin.`);
        } catch (error) {
            console.error("Error promoting user to admin:", error);
            alert(`Failed to promote user ${username} to admin. Please try again.`);
        }
    };

    const displayedUsers = isSearchPerformed && filteredUser ? [filteredUser] : users;

    return (
        <div>
            <NavBar userRole={localStorage.getItem('userRole')}>
                {localStorage.getItem('studentId')}
            </NavBar>
            <div className="w-full min-h-screen bg-gradient-to-br from-green-300 via-teal-200 to-cyan-300 flex items-center justify-center p-4 sm:p-8 w-full space-y-2 animate-fade-in">
                <div className="w-full max-w-6xl space-y-2 animate-fade-in p-0">
                    <div className="flex flex-col items-center space-y-4 pt-5 px-4">
                        <div className="w-full max-w-xl">
                            <h1 className="text-center text-2xl sm:text-4xl font-serif font-light tracking-wide text-gray-800 uppercase">
                                Data Center
                            </h1>
                            <div className="mt-2 text-sm font-sans font-medium text-gray-600 tracking-widest uppercase flex items-center gap-5">
                                <span className="flex-1 border-t border-b border-gray-300 bg-gray-100 h-1"></span>
                                Please Enter User ID
                                <span className="flex-1 border-t border-b border-gray-300 bg-gray-100 h-1"></span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:space-x-2 items-center space-y-2 sm:space-y-0 w-full max-w-md">
                            <input
                                type="text"
                                id="searchById"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter User ID"
                            />
                            <button
                                onClick={handleSearch}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-full px-4 sm:px-10 lg:px-20 mt-10">
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full py-4">
                                <div className="overflow-hidden border border-gray-300 rounded-lg shadow-md">
                                    <table className="w-full text-left text-lg font-light">
                                        <thead className="bg-gray-200 border-b font-medium text-base text-center">
                                            <tr>
                                                <th scope="col" className="px-4 py-6 sm:px-8 sm:py-6 bg-green-100">Full Name</th>
                                                <th scope="col" className="px-4 py-6 sm:px-8 sm:py-6 hidden md:table-cell bg-yellow-100">Student ID</th>
                                                <th scope="col" className="px-4 py-6 sm:px-8 sm:py-6 hidden md:table-cell bg-red-100">Email</th>
                                                <th scope="col" className="px-4 py-6 sm:px-8 sm:py-6 hidden md:table-cell bg-purple-100">Is Admin</th>
                                                <th scope="col" className="px-4 py-6 sm:px-8 sm:py-6 bg-teal-100">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedUsers.length > 0 ? (
                                                displayedUsers.map((user, index) => (
                                                    <tr
                                                        key={user._id}
                                                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 text-center"
                                                    >
                                                        <td className="whitespace-nowrap px-4 py-4 sm:px-8 sm:py-6 bg-green-50">
                                                            {`${user.first_name} ${user.last_name}`}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-4 sm:px-8 sm:py-6 hidden md:table-cell bg-yellow-50">
                                                            {user.student_id}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-4 sm:px-8 sm:py-6 hidden md:table-cell bg-red-50">
                                                            {user.email}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-4 sm:px-8 sm:py-6 hidden md:table-cell bg-purple-50">
                                                            {user.is_admin ? "Yes" : "No"}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-4 sm:px-8 sm:py-6 bg-teal-50">
                                                            <div className="flex flex-col space-y-2">
                                                                <button
                                                                    onClick={() => handleDelete(user.student_id)}
                                                                    className="px-2 py-1 w-30 bg-[#a5a6aa] text-white rounded-md hover:bg-red-600 transition flex justify-center items-center space-x-2"
                                                                >
                                                                    <span>Delete</span>
                                                                    <FaTrash />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEdit(user.student_id)}
                                                                    className="px-2 py-1 w-30 bg-[#a5a6aa] text-white rounded-md hover:bg-blue-500 transition flex justify-center items-center space-x-2"
                                                                >
                                                                    <span>Edit</span>
                                                                    <FaPencil />
                                                                </button>
                                                                <button
                                                                    onClick={() => handlePromoteToAdmin(user.username)}
                                                                    className="px-2 py-1 w-30 bg-[#a5a6aa] text-white rounded-md hover:bg-yellow-500 transition flex justify-center items-center space-x-2"
                                                                >
                                                                    <span>Promote</span>
                                                                    <FaCrown />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-6 text-gray-500">
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
        </div>
    );
}
