const limits = {
    name: 25,
    email: {
        min: 7,
        max: 50
    },
    business_name: {
        min: 4,
        max: 50
    },
    business_nature: {
        min: 4,
        max: 20
    },
    registration_number: {
        min: 5,
        max: 18
    },
    country: 75,
    user_mobile: {
        min: 8,
        max: 10
    },
    other_mobile: {
        min: 11,
        max: 18
    },
    bank_identifier: 40,
    occupation: 50,
    address: 300,
    flat: 30,
    building: 30,
    street: 100,
    city: 35,
    user_zip: 4,
    other_zip: 9,
    state: 35,
    bank: {
        min: 3,
        max: 50
    },
    account_number: {
        min: 5,
        max: 30
    }
}

export default limits;