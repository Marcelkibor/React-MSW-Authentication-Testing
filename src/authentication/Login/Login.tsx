import { useState } from "react";
import storage from "../../app/localStorage";
import Logo from '../../public/am-logo.jpg';
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import LoginRequest from "./LoginRequest";
const Login = () => {
const userInformation = localStorage.getItem("authenticated")
if(userInformation == "true"){
    window.location.href = "/"
}
const [errorMessage,setErrorMessage] = useState("");
const [FormData,SetFormData] = useState({username:'',userPassword:'',})
const { username, userPassword} = FormData;
const [Loading,isLoading] = useState(false)

const onChange = (e: { target: { name: any; value: any; };
})=>{SetFormData({...FormData, [e.target.name]:e.target.value})} 
//Handle Authentication
const submitLoginForm=  async ()=>{
isLoading(true) 
const errorMessage = await LoginRequest(username, userPassword);
    if (errorMessage) {
        setErrorMessage(errorMessage)
    }
isLoading(false)
}
//Handle Error Messages
const DisplayErrorMessage = ()=>{
return(
    <div >
        <p data-testid = "state-error"className="text-red-500 font-bold">{errorMessage}</p>
    </div>
    ) 
}
return (
    <section className="h-screen bg-gray-100 flex items-center ">
            <div className="bg-white shadow-md border px-10 pt-10 pb-10 mx-auto">
        <img src = {Logo} className = "h-10 mx-auto mb-10"/>
                <form>
                    <div>
                    <input autoComplete="off" onChange={onChange} name = "username" className="shadow  border rounded p-4 " type="text" placeholder="Username" required />
                        </div>
                            <div className="mt-10">
                            <input autoComplete="off" onChange={onChange} name="userPassword" className="shadow border rounded p-4" type="password" placeholder="Password" required />
                            </div>
                                    <div data-test-id="errors-div">
                                    {errorMessage && <DisplayErrorMessage/>}
                            </div>
                        <div className="flex justify-end p-5">
                        {Loading ? <ClipLoader size={50} color ="blue"/>: 
                        <button onClick={submitLoginForm} className= "bg-blue-500 hover:bg-blue-700  w-[35%] text-white font-bold py-4 px-4 rounded" type="button"> Log In </button>}
                    </div>
                </form>
            </div> 
    </section>
)
}
export default Login;
