import './Accounts.css';

import { useData } from '../../context/data.context';

import ShopperCard from '../../components/cards/Shopper/Shopper.jsx';

export default function Accounts () {

    const { isLoading, shoppers } = useData();

    return (
        <div className='accounts'>
            <h1>Accounts Page</h1>

            <div className='list'>
                {
                    isLoading ? <p>Loading...</p> :
                    shoppers.map((shopper) => (
                        <ShopperCard key={shopper.IDSHOPPER} data={shopper} />
                    ))
                }
            </div>
        </div>
    )
}
