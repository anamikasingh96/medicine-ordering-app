const PostgreSql = require('./db-config-queries');
const constants = require('./constant');
const util = require('./utility');

const placeOrder = async (orderDetails) => {
    try {
        if (orderDetails.medicines.length) {
            const orderId = util.generateOrderId(6);
            let query = `insert into order_details (order_id, state, status) values ('${orderId}', ${constants.STATE.PLACED}, ${constants.STATUS.ACTIVE})`;
            let queryRes = await PostgreSql.query(query);
            if(queryRes.rowCount){
                query = `insert into order_medicine_details (order_id, medicine_name, quantity)`;
                orderDetails.medicines.forEach((data, index) => {
                    if(index == orderDetails.medicines.length-1){
                        query += `values('${orderId}', '${data.medicine_name}', ${data.quantity})`;
                    }else{
                        query += `values('${orderId}', '${data.medicine_name}', ${data.quantity}),`;
                    }
                })
                await PostgreSql.query(query);
                return {
                    orderId: orderId,
                    status: true
                }
            }  
        }
    } catch (e) {
        console.log(e);
    }
    return {
        orderId: null,
        status: false
    }
}

const getMedicineDetails = async (id) => {
    try {
        let query = `SELECT * from medicine where id = ${id}`;
        let medicine = await PostgreSql.query(query);
        return {
            data: medicine,
            status: true
        }
    }
    catch(e) {
        console.log(JSON.stringify(e));
    }
}

const getMatchedMedicine = async (queryStr) => {
    try {
        let query = `SELECT medicine_name from medicine where medicine_name like '%${queryStr}%'`;
        let cName = await PostgreSql.query(query);
        return {
            data: cName,
            status: true
        }
    }
    catch (e) {
        console.log(JSON.stringify(e));
    }
}
const insertRecord = async (medicineName, medicineExpiryDate, balanceQuantity, mrp, manufacturer) => {
    try {
        let query = `insert into medicine (medicine_name, medicine_expiry_date, balance_qty, mrp, manufacturer) values('${medicineName}', '${medicineExpiryDate}', ${balanceQuantity}, ${mrp}, '${manufacturer}')`;
        return await PostgreSql.query(query);
    }
    catch (e) {
        console.log(e);
    }
}

const getOrderStatus = async (orderId) => {
    try{
        let query = `select state from orders where order_id = ${orderId}`;
        return await PostgreSql.query(query);
        
    }
    catch(e){
        console.log('error in getOrderStatus: ', e)
    }
}

module.exports = {
    placeOrder,
    getMedicineDetails,
    getMatchedMedicine,
    insertRecord,
    getOrderStatus
}