const PostgreSql = require('../db-config-queries');
const constants = require('../constant');

const placeOrder = async (medicineList) => {
    try {
        if (typeof medicineList === 'object' && medicineList.length) {
            let query = `insert into orders (state) values (${constants.ORDER_STATE.ACTIVE}) returning id`;
            let order = await PostgreSql.query(query);
            if (order.status) {
                let query = `insert into order_details (order_id, c_name, quantity, c_unique_id) values`;
                medicineList.forEach((data) => {
                    //create an order and put all data in ordered-medicine table
                    query += `(${order.id},${data.c_name}, ${data.quantity}, ${data.c_unique_id})`;
                })
                await PostgreSql.query(query);
                return {
                    order_id: order.id,
                    status: true
                }
            }
        }
    } catch (e) {
        console.log(JSON.stringify(e));
    }
}

const getMedicineDetails = async (c_unique_id) => {
    try {
        let query = `SELECT * from medicine where c_unique_id = ${c_unique_id}`;
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
        let query = `SELECT c_name from medicine where c_name like '%${queryStr}%'`;
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
const insertRecord = async (c_name, c_batch_no, d_expiry_date, n_balance_qty, c_unique_code, c_schemes, n_mrp, c_manufacturer, hsn_code) => {
    try {
        let query = `insert into medicine (c_name, c_batch_no, d_expiry_date, n_balance_qty, c_unique_code, c_schemes, n_mrp, c_manufacturer, hsn_code) values('${c_name}', '${c_batch_no}', '${d_expiry_date}', ${n_balance_qty}, '${c_unique_code}', ${c_schemes}, ${n_mrp}, '${c_manufacturer}', ${hsn_code})`;
        await PostgreSql.query(query);
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = {
    placeOrder,
    getMedicineDetails,
    getMatchedMedicine,
    insertRecord
}