//import { GoogleLogin } from "@react-oauth/google";
import React from "react";

const Home = () => {
    const googleLogin = () =>{
        window.location.href ='http://localhost:8080/oauth2/authorization/google';
    };
    return (
        <div>
            <button onClick ={googleLogin}> Login with Google</button>
        </div>
    )
};
export default Home;