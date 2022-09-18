const Handlebars = require('handlebars');
const handlebars = require('express-handlebars');

module.exports = {
    sum: (a, b) => a + b,
    stt: (status) => {
        if (status === 0) {
            return "Offline"
        }else {
            return "Online"
        }
    },
    sttService: (status) => {
        if (status === 0) {
            return "Bảo trì"
        }else {
            return "Hoạt động"
        }
    },
    checkOnOff: (status) => {
        if (status === 0) {
            return "On"
        }else {
            return "Off"
        }
    },
    checkAttrStatusOnOff: (status) => {
        if (status === 0) {
            return "success"
        }else {
            return "danger"
        }
    },
    checkAttrStatusStt: (status) => {
        if (status === 0) {
            return "danger"
        }else {
            return "success"
        }
    },
    checkWhenOnOff: (status) => {
        if (status === 0) {
            return 1
        }else {
            return 0
        }
    },
    checkBlock: (block) => {
        if (block === 0) {
            return "Block"
        }else {
            return "Unblock"
        }
    },
    checkIdBlock: (block) => {
        if (block === 0) {
            return 1
        }else {
            return 0
        }
    }
}