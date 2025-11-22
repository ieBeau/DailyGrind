CREATE OR REPLACE PROCEDURE STATUS_SHIP_SP (
    p_basketid IN BB_BASKETSTATUS.idbasket%TYPE,
    p_date IN BB_BASKETSTATUS.dtstage%TYPE,
    p_shipper IN BB_BASKETSTATUS.shipper%TYPE,
    p_shipnum IN BB_BASKETSTATUS.shippingnum%TYPE
)
AS
BEGIN
    INSERT INTO BB_BASKETSTATUS (idstatus, idbasket, idstage, dtstage, shipper, shippingnum)
    VALUES (BB_STATUS_SEQ.NEXTVAL, p_basketid, 3, p_date, p_shipper, p_shipnum);
    COMMIT;
END STATUS_SHIP_SP;
