import '../styles/scenes/Coffee.css';

import CoffeeList from "../components/lists/CoffeeList";

export default function Coffee () {
    return (
        <div className='coffee'>
            
            <h2 className='coffee-menu-title'>Coffee Menu</h2>
            
            <CoffeeList />
            
        </div>
    )
}