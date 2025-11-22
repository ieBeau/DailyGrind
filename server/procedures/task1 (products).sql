CREATE OR REPLACE PROCEDURE group_task_1 (
    p_product_id IN BB_PRODUCT.idproduct%TYPE DEFAULT NULL,
    p_product_detail IN BB_PRODUCT.description%TYPE DEFAULT NULL
)
AS
BEGIN
    UPDATE BB_PRODUCT
    SET description = p_product_detail
    WHERE idproduct = p_product_id;
    COMMIT;
END group_task_1;