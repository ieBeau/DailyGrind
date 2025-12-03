import { fetchApi } from "../utils/fetch.js";

const updateShippingStatus = async function (basketid, date, shipper, shipnum) {
  const response = await fetchApi(`/shipping`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ basketid, date, shipper, shipnum }),
  })
    .then((response) => response.json())
    .catch((error) => {
      throw new Error("Error: " + error.message);
    });

  return response;
};

export default { updateShippingStatus };
