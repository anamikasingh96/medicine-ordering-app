module.exports.STATE = {
    PLACED : 1,
    SHIPPED : 2,
    OUT_FOR_DELIVERY: 3,
    DELIVERED: 4,
    CANCELLED: 5
}

module.exports.REVSTATE = {
    1: "PLACED",
    2: "SHIPPED",
    3: "OUT_FOR_DELIVERY",
    4: "DELIVERED",
    5: "CANCELLED"
}

module.exports.STATUS = {
    ACTIVE: true,
    INACTIVE: false
}