import { useShopper } from "../../../context/shopper.context";
import "./Shopper.css";

export default function ShopperCard({ data }) {

    const { shopper, setShopper } = useShopper();

    const handleClick = (e) => {
        e.preventDefault();
        setShopper(data);
    }

    return (
        <div className={`shopper-container ${shopper?.IDSHOPPER === data.IDSHOPPER ? 'selected' : ''}`} onClick={handleClick}>
            <div className="shopper-header">
                <p className="username">{data.FIRSTNAME} {data.LASTNAME}</p>
                <p className="id">{data.IDSHOPPER}</p>
            </div>

            <p>Username: {data.USERNAME || "N/A"}</p>
            <p>Email: {data.EMAIL}</p>
            <p>Phone: {data.PHONE}</p>
            <p>Address: {data.ADDRESS}, {data.CITY}, {data.PROVINCE || data.STATE} {data.ZIPCODE}</p>
        </div>
    );
}
