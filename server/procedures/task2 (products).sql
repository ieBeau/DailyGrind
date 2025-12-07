CREATE OR REPLACE PROCEDURE PROD_ADD_SP (
    p_product_name IN BB_PRODUCT.productname%TYPE,
    p_product_description IN BB_PRODUCT.description%TYPE,
    p_product_image IN BB_PRODUCT.productimage%TYPE,
    p_product_image_type IN BB_PRODUCT.productimage_type%TYPE,
    p_price IN BB_PRODUCT.price%TYPE,
    p_active_status IN BB_PRODUCT.active%TYPE
)
AS
BEGIN
    INSERT INTO BB_PRODUCT (idproduct, productname, description, productimage, productimage_type, price, active)
    VALUES (BB_PRODID_SEQ.NEXTVAL, p_product_name, p_product_description, p_product_image, p_product_image_type, p_price, p_active_status);
    COMMIT;
END PROD_ADD_SP;
