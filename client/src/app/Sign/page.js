export default function page(){return(
    <div>
        <h1>Sign</h1>
        <div className="bg-[#fff] rounded-2xl box-border h-[450px] p-5 w-[520px]">
                <div className="text-[#eee] font-sans text-4xl font-semibold mt-8 text-center text-green-500">
                    Sign In
                </div>

                <div className="relative w-full mt-10">
                    <input
                        id="user_name"
                        className="bg-[#fff] h-[70px] rounded-xl border border-green-500 box-border text-bg-black text-lg outline-none px-5 pt-1 w-full"
                        type="text"
                        placeholder="User Name"
                    />
                </div>
        <div>
            <input type = "text" id = "submit"></input>
            <button>Submit</button>
        </div>
    </div>
    </div>

)}


