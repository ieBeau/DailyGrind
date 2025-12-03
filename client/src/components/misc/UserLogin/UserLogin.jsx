import "./UserLogin.css";

import { useState } from "react";
import { useAdmin } from "../../../context/admin.context";
import { useData } from "../../../context/data.context";
import { useShopper } from "../../../context/shopper.context";

export default function UserLogin() {

    const { admin, signIn, signOut } = useAdmin();
    const { shoppers } = useData();
    const { shopper, setShopper } = useShopper();

    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: null, text: "" });
    const [showLoginForm, setLoginForm] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        const form = e.target.closest('.user-login-form');
        
        const username = form.querySelector('input[name="username"]').value; // Username: admin
        const password = form.querySelector('input[name="password"]').value; // Password: Password123
        const adminData = { username, password };

        const shopperId = form.querySelector('select[name="shopper"]').value;

        setIsLoading(true);

        if (shopperId) {
            setShopper(shoppers.filter(s => s.IDSHOPPER === parseInt(shopperId))[0]);
            setStatusMessage({ type: null, text: "" });
            setIsLoading(false);
            setLoginForm(false);
            return;
        }

        await signIn(adminData)
        .then((data) => {
            if (!data.success) throw new Error(data.message);
            setStatusMessage({ type: null, text: "" });
            setLoginForm(false);
        })
        .catch((error) => {
            setStatusMessage({ type: "error", text: error.message || "Login failed" });
        })
        .finally(() => setIsLoading(false));
    
    };

    const handleLogout = () => {
        signOut();
        setShopper(null);
        setStatusMessage({ type: null, text: "" });
    };

    const handleCancel = () => {
        setLoginForm(false);
        setStatusMessage({ type: null, text: "" });
    };

    return (
        <div className="user-login-container">
            { showLoginForm && 
                (
                    <div className="user-login-background" onMouseDown={(e) => { if (e.target === e.currentTarget) setLoginForm(false); }}>
                        <div className="user-login-form">
                            <h2>Admin Login</h2>
                            
                            <div className="form-group">
                                <label className="form-label">Username:</label>
                                <input type="text" name="username" className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password:</label>
                                <input type="password" name="password" className="form-input" />
                            </div>

                            <h2>User Login</h2>

                            <div className="form-group">
                                <label className="form-label">Select Shopper:</label>
                                <select className="form-select" name="shopper">
                                    <option value="">-- Select a shopper --</option>
                                    {shoppers.map((sh) => (
                                        <option key={sh.IDSHOPPER} value={sh.IDSHOPPER}>
                                        {sh.FULLNAME} (ID: {sh.IDSHOPPER})
                                    </option>
                                    ))}
                                </select>
                            </div>

                            <button onClick={handleLogin} disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Login"}
                            </button>
                            <button onClick={handleCancel} disabled={isLoading}>
                                Cancel
                            </button>

                            <div className={`status-message ${statusMessage.type}`}>
                                {statusMessage.type ? statusMessage.text : ""}
                            </div>
                        </div>
                    </div>
                )
            }

            {
                admin || shopper ? (
                    <div className="user-login-info">
                        <span className="user-login-username">Hello, {admin ? admin.USERNAME : shopper ? `${shopper.USERNAME}` : ""}</span>
                        <button className="user-logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <button className="user-login-button" onClick={() => setLoginForm(true)}>Login</button>
                )
            }

        </div>
    );
}
