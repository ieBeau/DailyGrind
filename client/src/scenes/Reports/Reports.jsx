import './Reports.css';

import { useData } from '../../context/data.context';

export default function Reports () {

    const { isLoading, baskets, shoppers } = useData();
    
    return (
        <div className='reports'>
            <h1>Reports Page</h1>

            { isLoading ? <p>Loading Data...</p> : 
                <>
                    <h2>Basket Status Report</h2>
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
        </div>
    )
}