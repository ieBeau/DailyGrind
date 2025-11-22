CREATE OR REPLACE PROCEDURE REPORT_1 (
    p_basket_id IN BB_BASKETITEM.IDBASKET%TYPE,
    p_basket_status OUT VARCHAR2
) AS
    CURSOR cur_basket IS
        SELECT bi.idbasket, bi.quantity, p.stock
        FROM bb_basketitem bi INNER JOIN bb_product p
        USING (idproduct)
        WHERE bi.idbasket = p_basket_id;
    lv_flag_txt CHAR(1) := 'Y';
BEGIN
    FOR rec_basket IN cur_basket LOOP
        IF rec_basket.stock < rec_basket.quantity THEN lv_flag_txt := 'N'; END IF;
    END LOOP;
    IF lv_flag_txt = 'Y' THEN p_basket_status := 'All items in stock!'; END IF;
    IF lv_flag_txt = 'N' THEN p_basket_status := 'All items NOT in stock!'; END IF;
END REPORT_1;