import "./BasketQuantitySize.css";

import { useEffect, useState } from "react";

import { useBasket } from "../../../context/basket.context";

export default function BasketQuantitySize() {

    const { shoppingCart } = useBasket();

    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
      if (!shoppingCart.products || shoppingCart.products.length === 0) return;
        setQuantity(shoppingCart.products.reduce((total, item) => total + item.QUANTITY, 0));
    }, [shoppingCart]);

  return (
    <div className="basket-quantity-size-container">
      {quantity}
    </div>
  );
}
