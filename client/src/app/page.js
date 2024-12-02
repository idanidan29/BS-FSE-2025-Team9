import Image from "next/image";
import Navbar from "./components/NavBar";
import Layout from "./components/layout";

export default function Home() {
    return (

        <div className="flex items-center justify-center h-screen bg-[#fff]">
            <div className="bg-[#fff] rounded-2xl box-border h-[450px] p-5 w-[520px]">
                <div className="text-[#eee] font-sans text-4xl font-semibold mt-8 text-center">Sing In</div>


                <div className="relative w-full mt-10">
                    <input
                        id="user_name"
                        className="bg-[#fff] h-[70px] rounded-xl border border-green-500 box-border text-bg-black text-lg h-[50px] outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="User Name"
                    />
                </div>

                <div className="relative w-full mt-7">
                    <input
                        id="user_name"
                        className="bg-[#fff] h-[70px] rounded-xl border border-green-500 box-border text-bg-black text-lg h-[50px] outline-none px-5 pt-1 w-full"
                        type="Password"
                        placeholder="Password"
                    />


                </div>

                <button className="bg-green-500 rounded-full border-0 text-[#eee] text-lg h-[50px] mt-9 w-full hover:bg-green-600">
                    Login
                </button>
                <button className="bg-[rgb(209,213,219) rounded-xl border-0 text-[#eee] text-lg h-[50px] mt-9 w-full hover:rgb(48 50 69)">
                    I Dont Have A User
                </button>
            </div>
        </div>

    );
}
