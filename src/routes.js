const express = require('express');
const router =express.Router();
const controller = require('./controller');

// router.post('/upload-csv', async (req, res) => {
//     let csv = req.files.file.data;
//     let array = csv.toString().split("\r");
//     let result = [];
//     for (let i = 1; i < array.length - 1; i++) {
//         let str = array[i].split(",");
//         await controller.insertRecord(str[0], str[1], str[2], str[3], str[4], str[5], str[6], str[7], str[8], str[9]);
//     }
//     // console.log(JSON.stringify(result));
// });

// add-medicine
router.post('/add-medicine', async (req, res) => {
    let {medicineName, medicineExpiryDate, balanceQuantity, mrp, manufacturer } = req.body;
    if(!medicineName ||  !medicineExpiryDate || !balanceQuantity || !mrp || !manufacturer){
        res.send({
            message : 'few medicine datails are missing'
        })
        return;
    }
    try{
        const queryResult = await controller.insertRecord(medicineName, medicineExpiryDate, balanceQuantity, mrp, manufacturer);
        // console.log(queryResult);
        if(queryResult.rowCount > 0){
            res.status(201).send({
                status: true,
                message: "medicine added successfully"
            })
            return;
        }
        
    }
    catch(err){
        console.log("error in /add-medicine: ", err)
    }
    res.send({
        status: false,
        message: "something went wrong"
    })
})

//track-order
router.get('/track-order', async (req, res) =>{
    let orderId = req.query.order_id;
    let orderStatus = await controller.getOrderStatus(orderId);
    res.send(orderStatus);
    return;

})

//based on matching
router.get('/search-medicine', async (req, res) => {
    let queryStr = req.query.keyword;
    let medicineNames = await controller.getMatchedMedicine(queryStr);
    console.log(medicineNames)
    if (medicineNames.status) {
        res.status(200).send({
            data: medicineNames.data.rows,
            status: true
        })
    }
});

//based on id
router.get('/get-medicine-details',async (req, res) => {
    let id = req.query.id;
    let medicine = await controller.getMedicineDetails(id);
    if (medicine.status) {
        res.status(200).send({
            data: medicine.rows,
            status: true
        })
    }
});

// get-order-details

router.post('/place-order', async (req, res) => {
    let orderDetails = req.body;
    let orderPlaced = await controller.placeOrder(orderDetails);
    console.log(orderPlaced)
    if (orderPlaced.status) {
        res.status(201).send({
            orderId: orderPlaced.orderId,
            message: "order placed successfully"
        })
    } else {
        res.status(200).send({
            orderId : null,
            message: 'order can not be placed'
        })
    }
})

module.exports = router;