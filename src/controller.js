const PostgreSql = require("./db-config-queries");
const constants = require("./constant");
const util = require("./utility");
const { Pool } = require("pg");

const placeOrder = async (orderDetails) => {
  try {
    if (orderDetails.medicines.length) {
      const orderId = util.generateOrderId(6);
      let query = `insert into order_details (order_id, state, status) values ('${orderId}', ${constants.STATE.PLACED}, ${constants.STATUS.ACTIVE})`;
      let queryRes = await PostgreSql.query(query);
      if (queryRes.rowCount) {
        query = `insert into order_medicine_details (order_id, medicine_name, quantity)`;
        orderDetails.medicines.forEach((data, index) => {
          if (index == orderDetails.medicines.length - 1) {
            query += `values('${orderId}', '${data.medicine_name}', ${data.quantity})`;
          } else {
            query += `values('${orderId}', '${data.medicine_name}', ${data.quantity}),`;
          }
        });
        await PostgreSql.query(query);
        return {
          orderId: orderId,
          status: true,
        };
      }
    }
  } catch (e) {
    console.log(e);
  }
  return {
    orderId: null,
    status: false,
  };
};

const getMedicineDetails = async (id) => {
  try {
    let query = `SELECT * from medicine where id = ${id}`;
    let medicine = await PostgreSql.query(query);
    return {
      data: medicine,
      status: true,
    };
  } catch (e) {
    console.log(JSON.stringify(e));
  }
};

const getMatchedMedicine = async (queryStr) => {
  try {
    let query = `SELECT medicine_name from medicine where medicine_name like '%${queryStr}%'`;
    let cName = await PostgreSql.query(query);
    return {
      data: cName,
      status: true,
    };
  } catch (e) {
    console.log(JSON.stringify(e));
  }
};
const insertRecord = async (
  medicineName,
  medicineExpiryDate,
  balanceQuantity,
  mrp,
  manufacturer
) => {
  try {
    let query = `insert into medicine (medicine_name, medicine_expiry_date, balance_qty, mrp, manufacturer) values('${medicineName}', '${medicineExpiryDate}', ${balanceQuantity}, ${mrp}, '${manufacturer}')`;
    return await PostgreSql.query(query);
  } catch (e) {
    console.log(e);
  }
};

const getOrderStatus = async (orderId) => {
  try {
    let query = `select state from order_details where order_id = '${orderId}' and status = ${constants.STATUS.ACTIVE}`;
    let queryRes = await PostgreSql.query(query);
    let res = queryRes.rows[0].state;
    if (queryRes.rows.length) {
      return {
        data: constants.REVSTATE[res],
      };
    }
  } catch (e) {
    console.log("error in getOrderStatus: ", e);
  }
  return {
    data: null,
  };
};

const getOrderDetails = async (orderId) => {
  try {
    let query = `select od.*, omd.medicine_name, omd.quantity from order_details as od join order_medicine_details as omd on od.order_id = omd.order_id where od.order_id = '${orderId}' and od.status = true`;
    let queryRes = await PostgreSql.query(query);
    let orderDetails = {
      medicineDetails: [],
    };

    if (queryRes.rows.length) {
      orderDetails.orderId = queryRes.rows[0].order_id;
      orderDetails.createdAt = queryRes.rows[0].created_at;
      orderDetails.updatedAt = queryRes.rows[0].updated_at;
      orderDetails.state = constants.REVSTATE[queryRes.rows[0].state];

      queryRes.rows.forEach((data) => {
        orderDetails.medicineDetails.push({
          medicine_name: data.medicine_name,
          quantity: data.quantity,
        });
      });
    }
    return orderDetails;
  } catch (e) {
    console.log("error in getOrderDetails: ", e);
  }
};

const cancelOrder = async (orderId) => {
  try {
    let query = `select state from order_details where status = false and order_id = '${orderId}'`;
    let queryRes = await PostgreSql.query(query);
    console.log(queryRes);
    if (queryRes.rows.length && queryRes.rows[0].state != constants.STATE.OUT_FOR_DELIVERY) {
      let query = `update order_details set status = ${constants.STATUS.INACTIVE} where order_id = '${orderId}' and status =${constants.STATUS.ACTIVE}`;
      await PostgreSql.query(query);

      query = `insert into order_details (order_id, state, status) values ('${orderId}', ${constants.STATE.CANCELLED}, ${constants.STATUS.ACTIVE})`;
      await PostgreSql.query(query);
      return {
        data: "order is cancelled",
        status: true,
      };
    } else {
      return {
        data: "order can not be cancelled",
        status: false,
      };
    }
  } catch (err) {
    console.log("error in getOrderStatus: ", err);
  }
};

module.exports = {
  placeOrder,
  getMedicineDetails,
  getMatchedMedicine,
  insertRecord,
  getOrderStatus,
  getOrderDetails,
  cancelOrder,
};
