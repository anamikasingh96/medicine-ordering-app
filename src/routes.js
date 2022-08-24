const { application } = require('express');
const express = require('express');
const router =express.Router();
const controller = require('./controller');

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
router.get('/track-order/:orderId', async (req, res) =>{
    let orderId = req.params.orderId;  //path-params
    let orderStatus = await controller.getOrderStatus(orderId);
    if(orderStatus.data != null){
        res.send({
            state: orderStatus,
            status: true
        })
    }else{
        res.send({
            state: null,
            status: false,
            message: "something went wrong"
        })
    }
})

router.get('/order-details/:orderId', async (req, res) => {
    let orderId = req.params.orderId;
    let orderDetails = await controller.getOrderDetails(orderId);
    res.send({
        details: orderDetails,
        status: true
    })
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

// cancel-order
router.put('/cancel-order/:orderId', async (req, res) =>{
    let orderId = req.params.orderId;
    let cancelRequest = await controller.cancelOrder(orderId);
    res.send(cancelRequest);
})


module.exports = router;