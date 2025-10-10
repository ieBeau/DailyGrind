import '../styles/scenes/Home.css';

import CoffeeList from "../components/lists/CoffeeList";

export default function Home () {
    return (
        <div className='home'>
            <h1>Daily Grind</h1>
            
            <h2>☕ Coffee Menu</h2>
            <CoffeeList />
        </div>
    )
}