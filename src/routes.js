const express = require('express');
const router =express.Router();
const controller = require('./controller');

router.post('/upload-csv', async (req, res) => {
    let csv = req.files.file.data;
    let array = csv.toString().split("\r");
    let result = [];
    for (let i = 1; i < array.length - 1; i++) {
        let str = array[i].split(",");
        await controller.insertRecord(str[0], str[1], str[2], str[3], str[4], str[5], str[6], str[7], str[8], str[9]);
    }
    // console.log(JSON.stringify(result));
});

//based on matching
router.get('/search-medicine', async (req, res) => {
    let queryStr = req.query.keyword;
    let medicineNames = await controller.getMatchedMedicine(queryStr);
    if (medicineNames.status) {
        res.status(200).send({
            data: medicineNames.rows,
            status: true
        })
    }
});

//based on id
router.get('/get-medicine-details',async (req, res) => {
    let c_unique_id = req.query.c_unique_id;
    let medicine = await controller.getMedicineDetails(c_unique_id);
    if (medicine.status) {
        res.status(200).send({
            data: medicine.rows,
            status: true
        })
    }
});

router.post('/place-order', async (req, res) => {
    let medicineList = req.body;
    let orderPlaced = await controller.placeOrder(medicineList);
    if (orderPlaced.status) {
        res.status(200).send({
            order_id : orderPlaced.id
        })
    } else {
        res.status(200).send({
            order_id : null,
            message: 'order can not be placed'
        })
    }
})

module.exports = router;