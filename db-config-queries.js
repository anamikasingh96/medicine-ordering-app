const Pool = require('pg').Pool

const pool = new Pool ({
    user: 'me',
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
    c_name varchar(40) not null,
    c_batch_no varchar(15),
    d_expiry_date timestamp with time zone,
    n_balance_qty integer,
    c_packaging varchar(10),
    c_unique_code integer,
    c_schemes varchar(20),
    n_mrp double precision,
    n_manufacturer varchar(50),
    hsn_code integer,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null
);

create table orders (
    id SERIAL PRIMARY KEY,
    state smallint,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null
)



create table order_details (
    id SERIAL PRIMARY KEY,
    order_id integer not null,
    c_name varchar(40),
    c_unique_id integer,
    quantity integer default 1,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null
)*/

