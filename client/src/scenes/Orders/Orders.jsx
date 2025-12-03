import "./Orders.css";
import { useMemo, useState } from "react";
import { useAdmin } from "../../context/admin.context";
import { useData } from "../../context/data.context";
import { useShopper } from "../../context/shopper.context";

import shippingApi from "../../api/shipping.api";

export default function Orders () {
    const { admin } = useAdmin();
    const { shopper } = useShopper();
    const { baskets, shoppers, products } = useData();

    const [selectedBasket, setSelectedBasket] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const placedOrders = useMemo(() => {
        if (!baskets || baskets.length === 0) return [];
        let filtered = baskets.filter((b) => b.ORDERPLACED === 1);

        if (!admin && shopper?.IDSHOPPER) {
            filtered = filtered.filter((b) => b.IDSHOPPER === shopper.IDSHOPPER);
        }

        const formatDate = (raw) => {
            if (!raw) return "";
            const d = new Date(raw);
            if (Number.isNaN(d.getTime())) return String(raw);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        return filtered.map((basket) => {
            const shopperRow = shoppers?.find((s) => s.IDSHOPPER === basket.IDSHOPPER);
            const fullname = shopperRow?.fullname;
            const totalQuantity = basket.QUANTITY ?? basket.ITEMS?.reduce((sum, item) => sum + item.QUANTITY, 0) ?? 0;

            return {
                id: basket.IDBASKET,
                shopperName: fullname,
                shopperId: basket.IDSHOPPER,
                dateCreated: formatDate(basket.DTCREATED),
                stage: basket.IDSTAGE,
                quantity: totalQuantity,
                total: basket.TOTAL,
                items: basket.ITEMS ?? [],
            };
        });
    }, [admin, baskets, shopper, shoppers]);

    const isAdmin = !!admin;
    const isLoggedIn = isAdmin || !!shopper;

    return (
        <div className="order">
            <div className="content-wrapper">
                <h1>
                    {isAdmin
                        ? "All Orders"
                        : shopper
                            ? "My Orders"
                            : "Orders"}
                </h1>

                {!isLoggedIn && (
                    <p>Please log in to view your orders.</p>
                )}

                {isLoggedIn && (
                    placedOrders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <div className="orders-table-wrapper">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order #</th>
                                        {isAdmin && <th>Shopper</th>}
                                        {isAdmin && <th>Shopper ID</th>}
                                        <th>Date</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Order Status</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {placedOrders.map((order, index) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            {isAdmin && <td>{order.shopperName}</td>}
                                            {isAdmin && <td>{order.shopperId}</td>}
                                            <td>{order.dateCreated}</td>
                                            <td>{order.quantity}</td>
                                            <td>${Number(order.total).toFixed(2)}</td>
                                            <td>{order.stage}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setSelectedBasket(order);
                                                        setSelectedStatus(order.stage);
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* Pop Up */}
                {selectedBasket && (
                    <div className="order-modal-backdrop" onClick={() => setSelectedBasket(null)}>
                        <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="order-modal-header">
                                <h2>Order #{selectedBasket.id}</h2>
                                <button className="close-btn" onClick={() => setSelectedBasket(null)}>
                                    ✕
                                </button>
                            </div>
                            <p>Order Date: {selectedBasket.dateCreated}</p>
                            {isAdmin && (
                                <p>Shopper: {selectedBasket.shopperName} (ID: {selectedBasket.shopperId})</p>
                            )}
                                <div className="order-status-update">
                                    <p>Order Status: </p>
                                    {isAdmin ? (
                                        <select
                                            value={selectedStatus ?? selectedBasket.stage}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                        >
                                            <option value="1">Pending</option>
                                            <option value="2">Processing</option>
                                            <option value="3">Shipped</option>
                                            <option value="4">Delivered</option>
                                            <option value="5">Cancelled</option>
                                        </select>
                                    ) : (
                                        <span>{selectedBasket.stage}</span>
                                    )}
                                </div>
                            <h3>Order Items</h3>
                            <ul className="order-items-list">
                                {selectedBasket.items.map((item) => {
                                    const product = products.find((p) => p.IDPRODUCT === item.IDPRODUCT);
                                    return (
                                        <li key={`${item.IDPRODUCT}-${item.SIZECODE}-${item.FORMCODE}`}>
                                            <div className="order-item-name">{product.PRODUCTNAME}</div>
                                            <div className="order-item-desc">{product.DESCRIPTION}</div>
                                            <div className="order-item-meta">
                                                <span>Qty: {item.QUANTITY}</span>
                                                <span>Price: ${Number(item.PRICE).toFixed(2)}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="order-modal-footer">
                                {isAdmin &&
                                    <div className="Update-Btn">
                                        <button>Update Status</button>
                                    </div>
                                }
                                <div>
                                    <p>{selectedBasket.stage}</p>
                                </div>
                                <strong>Total: ${Number(selectedBasket.total).toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}