CREATE OR REPLACE FUNCTION CK_SALE_SF (
    p_check_date IN BB_PRODUCT.salestart%TYPE,
    p_product_id IN BB_PRODUCT.idproduct%TYPE
)
RETURN VARCHAR2
AS
    v_result VARCHAR2(20);
BEGIN
    SELECT
        CASE
            WHEN p_check_date BETWEEN salestart AND saleend THEN 'ON SALE!'
            ELSE 'Great Deal!'
        END
    INTO v_result
    FROM BB_PRODUCT
    WHERE idproduct = p_product_id;

    RETURN v_result;
END CK_SALE_SF;