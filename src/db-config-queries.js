const Pool = require('pg').Pool

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
})


module.exports = {
    async query(text, params) {
        // invocation timestamp for the query method
        const start = Date.now();
        try {
            const res = await pool.query(text, params);
            // time elapsed since invocation to execution
            const duration = Date.now() - start;
            console.log(
                'executed query',
                {text, duration, rows: res.rowCount}
            );
            return res;
        } catch (error) {
            console.log('error in query', {text});
            throw error;
        }
    }
}
// Tables
/*CREATE TABLE medicine (
    id SERIAL PRIMARY KEY,
    medicine_name varchar(40) not null,
    medicine_expiry_date timestamp with time zone,
    balance_qty integer,
    mrp double precision,
    manufacturer varchar(50),
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null
);

create table order_medicine_details(
    order_id varchar(10) not null,
    medicine_name varchar(40),
    quantity integer default 1
)

create table order_details (
    id SERIAL PRIMARY KEY,
    state smallint,
    status boolean default true,
    order_id varchar(10) not null,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null
)*/

// select od.*, omd.medicine_name, omd.quantity from order_details as od join order_medicine_details as omd on od.order_id = omd.order_id 
// where od.order_id = 'orderId' and od.status = true;