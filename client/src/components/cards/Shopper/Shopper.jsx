import { useShopper } from "../../../context/shopper.context";
import "./Shopper.css";

export default function ShopperCard({ data }) {

    const { shopper, setShopper } = useShopper();

    const handleClick = (e) => {
        e.preventDefault();
        setShopper(data);
    }

    const formatPhoneNumber = (phoneNumberString) => {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) return '(' + match[1] + ') ' + match[2] + '-' + match[3];

        return phoneNumberString;
    }

    return (
        <div className={`shopper-container ${shopper?.IDSHOPPER === data.IDSHOPPER ? 'selected' : ''}`} onClick={handleClick}>
            <div className="shopper-header">
                <p className="username">{data.FIRSTNAME} {data.LASTNAME}</p>
                <p className="id">#{data.IDSHOPPER}</p>
            </div>

            <div className="shopper-details">
                <div className="detail-row">
                    <label>Username:</label>
                    <p>{data.USERNAME || "N/A"}</p>
                </div>

                <div className="detail-row">
                    <label>Email:</label>
                    <p>{data.EMAIL}</p>
                </div>

                <div className="detail-row">
                    <label>Phone:</label>
                    <p>{formatPhoneNumber(data.PHONE)}</p>
                </div>

                <div className="detail-row">
                    <label>Address:</label>
                    <p>{data.ADDRESS}, {data.CITY}, {data.PROVINCE || data.STATE} {data.ZIPCODE}</p>
                </div>
            </div>
        </div>
    );
}
