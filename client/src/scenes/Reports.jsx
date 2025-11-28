import '../styles/scenes/Reports.css';

import { useState } from 'react';
import reportApi from '../api/report.api';

export default function Reports () {

    const [customerId, setCustomerId] = useState('');
    const [basketId, setBasketId] = useState('');
    const [basketStatus, setBasketStatus] = useState(null);
    const [totalPurchases, setTotalPurchases] = useState(null);
    const [error, setError] = useState(null);


    const fetchBasketStatus = async () => {
        setError(null);
        setBasketStatus(null);
        try {
            const data = await reportApi.getBasketStatus(basketId);
            setBasketStatus(data.status);
        } catch (err) {
            setError(err.message || 'Failed to fetch basket status');
        }
    };

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
            <h1>Reports Page</h1>
            <section>
                <h2>Basket Status</h2>
                <input
                    type="text"
                    placeholder="Basket ID"
                    value={basketId}
                    onChange={(e) => setBasketId(e.target.value)}
                />
                <button onClick={fetchBasketStatus}>Check Status</button>
                {basketStatus && <p>Status: {basketStatus}</p>}
            </section>

            <section>
                <h2>Total Purchases</h2>
                <input
                    type="text"
                    placeholder="Customer ID"
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

            {error && <p className="error">{error}</p>}
        </div>
    );
}