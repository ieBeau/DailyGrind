CREATE OR REPLACE PROCEDURE BASKET_ADD_SP (
    p_productid IN BB_BASKETITEM.idproduct%TYPE,
    p_basketid  IN BB_BASKETITEM.idbasket%TYPE,
    p_price     IN BB_BASKETITEM.price%TYPE,
    p_quantity  IN BB_BASKETITEM.quantity%TYPE,
    p_sizecode  IN BB_BASKETITEM.option1%TYPE,
    p_formcode  IN BB_BASKETITEM.option2%TYPE
)
AS
BEGIN
    UPDATE BB_BASKETITEM
    SET quantity = quantity + p_quantity
    WHERE idproduct = p_productid
      AND idbasket  = p_basketid;

    IF SQL%ROWCOUNT = 0 THEN
        INSERT INTO BB_BASKETITEM (idbasketitem, idproduct, idbasket, price, quantity, option1, option2)
        VALUES (BB_IDBASKETITEM_SEQ.NEXTVAL, p_productid, p_basketid, p_price, p_quantity, p_sizecode, p_formcode);
    END IF;
    COMMIT;
END BASKET_ADD_SP;
