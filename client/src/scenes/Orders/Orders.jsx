import "./Orders.css";
import { useState, useEffect } from "react";

export default function Orders () {
    const [shippingData, setShippingData] = useState({
        basketid: "",
        date: "",
        shipper: "",
        shipnum: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleUpdateShipping = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await updateShippingStatus(
                shippingData.basketid,
                shippingData.date,
                shippingData.shipper,
                shippingData.shipnum
            );

            setMessage({
                type: "success",
                text: "Shipping status updated successfully!",
            });

            console.log("Response:", response);
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="order">
        <h1>Order Page</h1>
        </div>
    );
}