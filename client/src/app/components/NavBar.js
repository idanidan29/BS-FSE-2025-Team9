'use client';  // Ensures the component runs on the client-side
import { useRouter } from 'next/navigation';  // Correct import for useRouter
import React, { useEffect, useState } from "react";  // Import React and hooks from 'react'
import Link from "next/link";
import Image from 'next/image';
import { FaRegFilePowerpoint } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaFileDownload } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaGifts } from "react-icons/fa";


const Navbar = ({ children, userRole }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();


    const sideList = [
        {
            icon: <FaRegFilePowerpoint className="text-2xl mr-2" />,
            title: "Parking File",
            path: `/${localStorage.getItem('username')}`,
        },
        {
            icon: <FaFileDownload className="text-2xl mr-2" />,
            title: "Exel File",
            path: `/${localStorage.getItem('username')}/exel`,
        },
        {
            icon: <FaChartSimple className="text-2xl mr-2" />,
            title: "Data",
            path: `/${localStorage.getItem('username')}/search`,
        },
        {
            icon: <FaSignOutAlt className="text-2xl mr-2" />,
            title: "sign out",
            path: "/",
        },
        {
            icon: <FaGifts className="text-2xl mr-2" />, // האייקון של ההגרלה
            title: "Lottery",
            path: `/${localStorage.getItem('username')}/lottery`, // הקישור לדף ההגרלה
        },
    ];




    const handleDeleteAccount = async () => {
        const userId = children;

        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Response error details:', errorDetails);
                throw new Error('Failed to delete the account.');
            }

            alert('Account deleted successfully!');
            console.log('Redirecting to /Sign');
            router.push('/Sign');
        } catch (error) {
            console.error('Error deleting account:', error.message);
            alert('Error deleting account.');
        }
    };


    const sideListDelete = {
        icon: <MdOutlineDeleteForever className="text-2xl mr-2" />,
        title: "Delete Account",
        onClick: async () => {
            await handleDeleteAccount(children);
            console.log('Delete account successful, redirecting to /Sign');
        },

    };

    const sideListDeleteAll = {
        icon: <MdOutlineDeleteForever className="text-2xl mr-2" />,
        title: "Delete All Accounts",
        onClick: async () => {
            router.push('/Sign'); // Redirect after action
            await handleDeleteAccount(children); // Perform delete

        },
    };


    const sideListSignoutStudent = {
        icon: <FaSignOutAlt className="text-2xl mr-2" />,
        title: "sign out",
        path: "/"
    };



    const navList = [

    ];

    const handleDrawer = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleEscKeyPress = (e) => {
            if (e.keyCode === 27 && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.body.style.setProperty("overflow", "hidden");
        } else {
            document.body.style.removeProperty("overflow");
        }

        document.addEventListener("keydown", handleEscKeyPress);

        return () => {
            document.removeEventListener("keydown", handleEscKeyPress);
        };
    }, [isOpen]);

    return (
        <nav className="sticky top-0 flex w-full items-center justify-between px-6 h-16 bg-gray-800 text-gray-200 border-b border-gray-700 z-10">
            <div className="flex items-center">
                <button className="mr-2" aria-label="Open Menu" onClick={handleDrawer}>
                    <GiHamburgerMenu className="text-3xl text-gray-300" />
                </button>

                <Image
                    src="/SCE_logo.png"
                    alt="Logo"
                    className="h-auto w-24"
                    width={96} // Next.js requires width and height attributes
                    height={24}
                />
            </div>

            <div className="flex items-center">
                <div className="hidden md:flex md:justify-between md:bg-transparent">
                    {navList.map(({ icon, title, path }, index) => {
                        return (
                            <Link key={index} href={path} passHref>
                                <button
                                    title={title}
                                    className="flex items-center p-3 font-medium mr-2 text-center bg-gray-700 text-gray-200 rounded hover:bg-gray-600 hover:text-white focus:outline-none focus:bg-gray-600 focus:text-white"
                                >
                                    <span>{icon}</span>
                                    <span>{title}</span>
                                </button>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {isOpen && (
                <div className="z-10 fixed inset-0 transition-opacity">
                    <div
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black opacity-50"
                        tabIndex="0"
                    ></div>
                </div>
            )}
            {userRole === "true" ? (
                <aside
                    className={`transform top-0 left-0 w-64 bg-gray-900 fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${isOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <span className="flex w-full items-center p-4 border-b border-gray-700">
                        <Image
                            src="/SCE_logo.png"
                            alt="Logo"
                            className="h-auto w-24"
                            width={96} // Next.js requires width and height attributes
                            height={24}
                        />
                    </span>

                    {sideList.map(({ icon, title, path }, index) => {
                        return (
                            <Link key={index} href={path} passHref>
                                <span className="flex items-center p-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
                                    <span className="mr-2">{icon}</span> <span>{title}</span>
                                </span>
                            </Link>
                        );
                    })}

                    <button
                        title="Delete Account"
                        onClick={sideListDelete.onClick} 
                        className="flex items-center p-4 text-gray-300 hover:bg-red-700 hover:text-white transition-colors duration-200"
                    >
                        <span>{sideListDelete.icon}</span> 
                        <span>{sideListDelete.title}</span> 
                    </button>
                    <button
                        title="Delete All Accounts"
                        onClick={sideListDelete.onClick} // Attach the delete handler
                        className="flex items-center p-4 text-gray-300 hover:bg-red-700 hover:text-white transition-colors duration-200"
                    >
                        <span>{sideListDeleteAll.icon}</span> 
                        <span>{sideListDeleteAll.title}</span> 
                    </button>

                </aside>
            ) : (
                <aside
                    className={`transform top-0 left-0 w-64 bg-gray-900 fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${isOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >


                    <Link href={sideListSignoutStudent.path} passHref>
                        <button
                            title="Sign Out"
                            className="flex items-center w-full p-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                        >
                            <span>{sideListSignoutStudent.icon}</span> 
                            <span>{sideListSignoutStudent.title}</span> 
                        </button>
                    </Link>

                    <button
                        title="Delete Account"
                        onClick={sideListDelete.onClick} // Attach the delete handler
                        className="absolute bottom-10 left-0 w-full p-2 flex justify-center items-center font-medium text-center bg-red-500 text-white  hover:bg-red-700 focus:outline-none"
                    >
                        <span>{sideListDelete.icon}</span> 
                        <span>{sideListDelete.title}</span> 
                    </button>

                </aside>

            )}



            <div>{children}</div>
        </nav>
    );


};

export default Navbar;
