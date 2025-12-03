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

    // Simple status update handler
    const handleUpdateStatus = async () => {
        if (!selectedBasket || !selectedStatus) return;
        // Add your update logic here
    };

    const handleCloseModal = () => {
        setSelectedBasket(null);
        setSelectedStatus(null);
    };

    return (
        <div className="order">
            <div className="content-wrapper">
                <div className="card wide-card">
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
            </div>
        </div>   

            {/* Pop Up */}
            {selectedBasket && (
                <div className="order-modal-backdrop" onClick={() => setSelectedBasket(null)}>
                    <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="card margin-bottom-large">

                            {/* Header */}
                            <div className="order-modal-header">
                                <h1 className="heading-tertiary">View Order #{selectedBasket.id}</h1>
                            </div>

                            {/* Order Details */}
                            <div className="order-details-grid">
                                <div className="order-detail-row">
                                    <div className="order-detail-label">Order Date:</div>
                                    <div className="order-detail-value">{selectedBasket.dateCreated}</div>
                                </div>
                                
                                <div className="order-detail-row">
                                    <div className="order-detail-label">Shopper:</div>
                                    <div className="order-detail-value">
                                        {isAdmin ? `${selectedBasket.shopperName} (ID: ${selectedBasket.shopperId})` : "Your Order"}
                                    </div>
                                </div>
                                
                                {/* Order Status */}
                                <div className="order-detail-row">
                                    <div className="order-detail-label">Order Status:</div>
                                    <div className="order-detail-value">
                                        {isAdmin ? (
                                        <select 
                                            value={selectedStatus ?? selectedBasket.stage} 
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="1">Pending</option>
                                            <option value="2">Processing</option>
                                            <option value="3">Shipped</option>
                                            <option value="4">Delivered</option>
                                            <option value="5">Cancelled</option>
                                        </select>
                                    ) : (
                                        <span className={`status-${selectedBasket.stage}`}>
                                            {selectedBasket.stage}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="order-divider" />
                            
                        {/* Order Items */}
                        <div className="order-items-section">
                            <h3>Order Items</h3>
                            
                            <div className="order-items-container">
                                {selectedBasket.items.map((item) => {
                                    const product = products?.find((p) => p.IDPRODUCT === item.IDPRODUCT);
                                    return (
                                        <div className="order-item-card" key={`${item.IDPRODUCT}-${item.SIZECODE}-${item.FORMCODE}`}>

                                        {/* Left: Product Info */}
                                        <div className="order-item-left">
                                            <div className="order-item-name">{product?.PRODUCTNAME ?? "Unknown Product"}</div>
                                            <div className="order-item-desc">{product?.DESCRIPTION ?? ""}</div>
                                        </div>
                                    
                                        {/* Right: Quantity & Price */}
                                        <div className="order-item-right">
                                            <div className="order-item-row">
                                                <span className="item-label">Qty:</span>
                                                <span className="item-value">{item.QUANTITY}</span>
                                            </div>
                                            <div className="order-item-row">
                                                <span className="item-label">Price:</span>
                                                <span className="item-value">${Number(item.PRICE).toFixed(2)}</span>
                                            </div>
                                            <div className="order-item-row">
                                                <span className="item-label">Subtotal:</span>
                                                <span className="item-value">${(item.QUANTITY * item.PRICE).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                            
                {/* Totals Section */}
                <div className="order-totals-section">
                <div className="order-totals-inner">
                    <div className="order-total-row">
                    <div className="order-total-label">Total Items:</div>
                    <div className="order-total-value">{selectedBasket.quantity}</div>
                    </div>
                    
                    <div className="order-total-row">
                    <div className="order-total-label">Order Total:</div>
                    <div className="order-total-value total-amount">
                        ${Number(selectedBasket.total).toFixed(2)}
                    </div>
                    </div>
                </div>
                </div>
                            
                {/* Footer Actions */}
                <div className="order-modal-actions">
                    {isAdmin && (
                        <button className="update-btn" onClick={handleUpdateStatus}>
                            Update Status
                        </button>
                    )}
                    <button className="close-btn" onClick={handleCloseModal}>
                        Close
                    </button>
                </div>
        
             </div>
        </div>
    </div>
    )}
</div>
    );
}