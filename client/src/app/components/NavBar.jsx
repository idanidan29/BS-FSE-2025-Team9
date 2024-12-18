"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegFilePowerpoint } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaFileDownload } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    

    const sideList = [
        {
            icon: <FaRegFilePowerpoint className="text-2xl mr-2" />,
            title: "Parking File",
            path: "/",
        },
        {
            icon: <FaFileDownload  className="text-2xl mr-2" />,
            title: "Exel File",
            path: "/Exel",
        },
        {
            icon: <FaChartSimple  className="text-2xl mr-2" />,
            title: "Data",
            path: "/Data",
        },
        {
            //icon: <FaSignOutAlt   className="text-2xl mr-2" />,
            title: "",
            path: "",
        },
        
    ];

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

                <img
                    src="/SCE_logo.png"
                    alt="Logo"
                    className="h-auto w-24"
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

            <aside
                className={`transform top-0 left-0 w-64 bg-gray-900 fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <span className="flex w-full items-center p-4 border-b border-gray-700">
                    <img
                        src="/SCE_logo.png"
                        alt="Logo"
                        className="h-auto w-32 mx-auto"
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
            </aside>
            <div>{children}</div>
        </nav>
    );
};

export default Navbar;
