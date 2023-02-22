import { useState } from "react";
import storage from "../../app/localStorage";
import Logo from '../../public/am-logo.jpg';
import React from "react";

const Login = () => {

return (
    <section className="h-screen bg-gray-100 flex items-center ">
            <div className="bg-white shadow-md border px-10 pt-10 pb-10 mx-auto">
        <img src = {Logo} className = "h-10 mx-auto mb-10"/>
                <form>
                    <div>
                    <input autoComplete="off" name = "username" className="shadow  border rounded p-4 " type="text" placeholder="Username" required />
                        </div>
                            <div className="mt-10">
                            <input autoComplete="off"  name="userPassword" className="shadow border rounded p-4" type="password" placeholder="Password" required />
                            </div>
                                    <div data-test-id="errors-div">
                            </div>
                        <div className="flex justify-end p-5">
                        <button className= "bg-blue-500 hover:bg-blue-700  w-[35%] text-white font-bold py-4 px-4 rounded" type="button"> Log In </button>
                    </div>
                </form>
            </div> 
    </section>
)
}
export default Login;
