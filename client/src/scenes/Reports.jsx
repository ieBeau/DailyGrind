import '../styles/scenes/Reports.css';

import { useCustomer } from '../context/customer.context';
import { useEffect, useState } from 'react';

export default function Reports () {

    const { customer, getCustomer } = useCustomer();

    const [customerId, setCustomerId] = useState('');

    const fetchCustomerData = async () => {
        const data = await getCustomer(customerId);
    }
    
    return (
        <div className='reports'>
            <h1>Reports Page</h1>

            <input type="text" placeholder="Customer ID" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
            <button onClick={() => fetchCustomerData()}>Fetch Customer Data</button>

            {customer ? (
                <div>
                    <h2>Customer Details (Customer ID: 21 - 27)</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                        {
                            Object.entries(customer).map(([key, value]) => (
                                <p key={key}>{key}: {value}</p>
                            ))
                        }
                    </div>
                </div>
            ) : (
                <p>No customer data available.</p>
            )}
        </div>
    )
}