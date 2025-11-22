CREATE OR REPLACE PROCEDURE TAX_COST_SP (
    p_shopper_state IN BB_TAX.STATE%TYPE DEFAULT NULL,
    p_subtotal IN NUMBER DEFAULT 0,
    p_tax_amount OUT NUMBER
)
AS
BEGIN
    SELECT ROUND((t.taxrate * p_subtotal), 2)
    INTO p_tax_amount
    FROM BB_TAX t
    WHERE t.state = p_shopper_state;
END TAX_COST_SP;
