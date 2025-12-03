import './Reports.css';

import { useData } from '../../context/data.context';
import { useEffect, useState } from 'react';
import reportApi from '../../api/report.api';

export default function Reports () {

    const { isLoading, baskets, shoppers } = useData();
    const [customerId, setCustomerId] = useState('');
    const [accountInfo, setAccountInfo] = useState(null);
    const [error, setError] = useState(null);

    const fetchTotalPurchases = async () => {
        setError(null);
        setAccountInfo(null);
        try {
            const data = await reportApi.getTotalPurchases(customerId);
            const info = shoppers.find(s => s.IDSHOPPER === parseInt(customerId));
            setAccountInfo({
                ...info,
                id: customerId,
                totalPurchase: parseFloat(data.total) || 0
            });
        } catch (err) {
            setError(err.message || 'Failed to fetch total purchases');
        }
    };
    
    useEffect(() => {
        if (customerId) fetchTotalPurchases();
    }, [customerId]);

    return (
        <div className='reports'>
            <div className="content-wrapper">
                <div className="card wide-card">
                    <h1>Reports Page</h1>

                    {/* Basket Status Report */}
                    <section>
                        <h2>Basket Status Report</h2>

                        { isLoading ? <p>Loading Data...</p> : 
                        <>                        
                            <table>
                                <thead>
                                    <tr>
                                        <th>Basket ID</th>
                                        <th>Shopper ID</th>
                                        <th>Shopper</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                    baskets.map((basket) => {
                                        const shopper = shoppers.find(s => s.IDSHOPPER === basket.IDSHOPPER);
                                        return (
                                            <tr key={basket.IDBASKET} className="basket-report">
                                                <td>{basket.IDBASKET}</td>
                                                <td>{basket.IDSHOPPER}</td>
                                                <td>{shopper?.FULLNAME}</td>
                                                <td>{basket.QUANTITY}</td>
                                                <td>{basket.STATUS}</td>
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>
                            </table>
                        </>                
                    }
                </section>

                {/* Shopper's Total Spending */}
                <section>
                    <h2>Total Purchases Report</h2>

                    <div className='total-spending-container'>
                        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="shopper-select">
                            <option value="">Select Shopper</option>
                            {shoppers.map((shopper) => (
                                <option key={shopper.IDSHOPPER} value={shopper.IDSHOPPER} >
                                    {shopper.FULLNAME} (ID: {shopper.IDSHOPPER})
                                </option>
                            ))}
                        </select>

                        <div>
                            <div className='shopper-detail-container'>
                                <label>Customer Details</label>

                                <div className='shopper-detail-row'>
                                    <label>Customer:</label>
                                    <p>{accountInfo?.FULLNAME ?? "--"}</p>
                                </div>

                                <div className='shopper-detail-row'>
                                    <label>Customer ID:</label>
                                    <p>{accountInfo?.id ?? "--"}</p>
                                </div>

                                <div className='shopper-detail-row'>
                                    <label>Total Purchases:</label>
                                    <p>{accountInfo?.totalPurchase ? `$${accountInfo?.totalPurchase.toFixed(2)}` : "--"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    </div>
    )
}
