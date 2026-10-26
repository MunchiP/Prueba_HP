function createValidBookingData() {
    return {
        firstname: 'Paula',
        lastname: 'Amaya',
        totalprice: 250,
        depositpaid: true,
        bookingdates: {
            checkin: '2026-11-01',
            checkout: '2026-11-05'
        },
        additionalneeds: 'Breakfast'
    };
}

export { createValidBookingData };
