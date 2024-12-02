import Image from "next/image";
import Navbar from "./components/NavBar";
import Layout from "./components/layout";

export default function Home() {
  return (
    <Layout>
        <div className="flex items-center justify-center h-screen bg-[#fff]">
            <div className="bg-[#15172b] rounded-2xl box-border h-[450px] p-5 w-[520px]">
                <div className="text-[#eee] font-sans text-4xl font-semibold mt-8 text-center">Sing In</div>
              

                <div className="relative w-full mt-10">
                    <input
                        id="user_name"
                        className="bg-[#303245] rounded-xl border-0 box-border text-[#eee] text-lg h-[50px] outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="User Name"
                    />
                    <div className="bg-[#15172b] h-5 w-[76px] absolute top-[-20px] left-5 rounded-lg transition-transform transform"></div>
                </div>

                <div className="relative w-full mt-7">
                    <input
                        id="password"
                        className="bg-[#303245] rounded-xl border-0 box-border text-[#eee] text-lg h-[50px] outline-none px-5 pt-1 w-full"
                        type="password"
                        placeholder="Password"
                    />
                    <div className="bg-[#15172b] h-5 w-[76px] absolute top-[-20px] left-5 rounded-lg transition-transform transform"></div>
                </div>

                <button className="bg-[#08d] rounded-xl border-0 text-[#eee] text-lg h-[50px] mt-9 w-full hover:bg-[#06b]">
                    Submit
                </button>
                <button className="bg-[rgb(209,213,219) rounded-xl border-0 text-[#eee] text-lg h-[50px] mt-9 w-full hover:rgb(48 50 69)">
                    I Dont Have A User
                </button>
            </div>
        </div>
        </Layout>
    );
}
