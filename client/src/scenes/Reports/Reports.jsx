import './Reports.css';

import { useData } from '../../context/data.context';
import { useState } from 'react';
import reportApi from '../../api/report.api';

export default function Reports () {

    const { isLoading, baskets, shoppers } = useData();
    const [customerId, setCustomerId] = useState('');
    const [totalPurchases, setTotalPurchases] = useState(null);
    const [error, setError] = useState(null);

    const fetchTotalPurchases = async () => {
        setError(null);
        setTotalPurchases(null);
        try {
            const data = await reportApi.getTotalPurchases(customerId);
            setTotalPurchases(data.total);
        } catch (err) {
            setError(err.message || 'Failed to fetch total purchases');
        }
    };


    return (
        <div className='reports'>
            <div className="content-wrapper">
                <div className="card wide-card">
                    <h1>Reports Page</h1>
                        <section>
                        <h2>Basket Status Report</h2>

                        { isLoading ? <p>Loading Data...</p> : 
                    <>                        
                        <table>
                            <thead>
                                <tr>
                                    <th>Basket ID</th>
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
                                            <td>{shopper?.fullname}</td>
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
                <section>
                    <h2>Total Purchases Report</h2>
                        <input
                            type="text"
                            placeholder="Shopper ID"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                        />
                    <button onClick={fetchTotalPurchases}>Customer Total</button>
                        {totalPurchases !== null ? (
                            <p>Total Purchases: {totalPurchases}</p>
                        ) : (
                            <p>No Customer Total Found</p>
                        )}
                </section>
            </div>
        </div>

    </div>
    )
}