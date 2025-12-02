import { useEffect } from "react";
import { useAdmin } from "../../../context/admin.context";
import "./UserLogin.css";

export default function UserLogin() {

    const { admin, signIn, signOut } = useAdmin();

    // TODO: Create a pop-up login form instead of using hardcoded data
    const adminData = {
        username: "user",
        password: "Password123"
    };

    return (
        <div className="user-login-container">
            {
                admin ? (
                    <div className="user-login-info">
                        <span className="user-login-username">Hello, {admin.USERNAME}</span>
                        <button className="user-logout-button" onClick={signOut}>Logout</button>
                    </div>
                ) : (
                    <button className="user-login-button" onClick={() => signIn(adminData)}>Login</button>
                )
            }

        </div>
    );
}
