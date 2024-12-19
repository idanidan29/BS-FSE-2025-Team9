"use client";
import NavBar from '../components/NavBar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Page({ params }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState(null);
    

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        student_id: '',
        phone_number: '',
        Study_Department: '',
        car_type: '',
        car_number: ''
    });

    const [isExistingDocument, setIsExistingDocument] = useState(false);

    useEffect(() => {
        (async () => {
            const username = localStorage.getItem('username');
            const resolvedParams = await params;
            

            if (username === resolvedParams.ParkingFile) {
                setIsAuthorized(true);

                // Fetch user data
                try {
                    const userResponse = await fetch(`http://localhost:5000/users/${username}`);
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUser(userData);

                        // Check if user is not an admin
                        if (!userData.is_admin) {
                            // Fetch document for the student_id
                            const documentResponse = await fetch(`http://localhost:5000/documents/${userData.student_id}`);
                            if (documentResponse.ok) {
                                const documentData = await documentResponse.json();

                                // Pre-fill the form with document data
                                setFormData({
                                    first_name: documentData.first_name || '',
                                    last_name: documentData.last_name || '',
                                    email: documentData.email || '',
                                    student_id: documentData.student_id || '',
                                    phone_number: documentData.phone_number || '',
                                    Study_Department: documentData.Study_Department || '',
                                    car_type: documentData.car_type || '',
                                    car_number: documentData.car_number || ''
                                });

                                // Indicate that this is an existing document
                                setIsExistingDocument(true);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user or document:", error);
                    router.push('/'); // Redirect on error
                }
            } else {
                router.push('/'); // Redirect if not authorized
            }
        })();
    }, [params, router]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async () => {
        const { first_name, last_name, email, student_id, phone_number, Study_Department, car_type, car_number } = {
            ...formData,
            student_id: Number(formData.student_id),
            phone_number: Number(formData.phone_number),
            car_number: Number(formData.car_number)
        };

        if (!first_name || !last_name || !student_id || !email || !phone_number || !Study_Department || !car_type || !car_number) {
            alert("Please fill in all fields!");
            return;
        }

        try {
            const url = `http://localhost:5000/documents/${isExistingDocument ? formData.student_id : ''}`;
            const method = isExistingDocument ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ first_name, last_name, email, student_id, phone_number, Study_Department, car_type, car_number }),
            });

            if (response.ok) {
                const message = isExistingDocument
                    ? 'Document updated successfully!'
                    : 'Document uploaded successfully!';
                alert(message);
                router.push('/');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const Navigation = () => {
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#fff] rtl">


            <NavBar children={localStorage.getItem('studentId')}></NavBar>

            <div className="bg-[#fff] rounded-2xl box-border min-h-[600px] p-5 w-[520px]">
                <div className="text-[#eee] font-sans text-4xl font-semibold mt-8 text-center text-green-500">
                    Application Form
                </div>


                {Object.keys(formData).map((key) => (
                    <div key={key} className="relative w-full mt-4">
                        <input
                            id={key}
                            value={formData[key]}
                            onChange={handleChange}
                            className="bg-[#fff] h-[60px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                            type={key === 'email' ? 'email' : 'text'}
                            placeholder={key.replace(/_/g, ' ')}
                        />
                    </div>
                ))}

                <button
                    onClick={handleSubmit}
                    className="bg-green-500 rounded-full border-0 text-[#eee] text-lg h-[50px] mt-9 w-full hover:bg-green-600"
                >
                    {isExistingDocument ? 'Update' : 'Send'}
                </button>
                <button
                    onClick={Navigation}
                    className="bg-[#fff] text-green-500 rounded-full border border-green-500 text-lg h-[50px] mt-5 w-full hover:bg-green-500 hover:text-white"
                >
                    Back
                </button>
            </div>
        </div>
    );
}
