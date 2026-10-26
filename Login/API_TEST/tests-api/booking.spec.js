import { test, expect } from '@playwright/test';
import BookingApi from '../apiClient/BookingApi.js';
import { createValidBookingData } from '../bookingData/BookingData.js';

// Persistencia de una reserva - POST + GET
test('API-001 | Persistencia de una reserva', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    const bookingData = createValidBookingData();

    const createResponse = await bookingApi.createBooking(bookingData);

    expect(createResponse.status()).toBe(200);

    const createdBooking = await createResponse.json();
    expect(createdBooking.bookingid).toEqual(expect.any(Number));

    const bookingId = createdBooking.bookingid;

    const getResponse = await bookingApi.getBooking(bookingId);

    expect(getResponse.status()).toBe(200);

    const savedBooking = await getResponse.json();
    expect(savedBooking).toEqual(bookingData);
});

// Consistencia tras actualizar una reserva - POST+PUT+GET
test('API-002 | Consistencia tras actualizar una reserva', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    const originalBooking = createValidBookingData();

    const createResponse = await bookingApi.createBooking(originalBooking);
    expect(createResponse.status()).toBe(200);
    const createdBooking = await createResponse.json();
    const bookingId = createdBooking.bookingid;

    const authResponse = await bookingApi.createToken(
        process.env.BOOKING_USERNAME ?? 'admin',
        process.env.BOOKING_PASSWORD ?? 'password123'
    );

    expect(authResponse.status()).toBe(200);
    const authData = await authResponse.json();
    expect(authData.token).toEqual(expect.any(String));

    // Preparar los datos nuevos para el PUT.
    const updatedBooking = {
        ...originalBooking,
        firstname: 'UpdatedName',
        totalprice: 400,
        additionalneeds: 'Breakfast and Wi-Fi'
    };

    const updateResponse = await bookingApi.updateBooking(
        bookingId,
        updatedBooking,
        authData.token
    );

    expect(updateResponse.status()).toBe(200);

    const getResponse = await bookingApi.getBooking(bookingId);

    expect(getResponse.status()).toBe(200);

    const savedBooking = await getResponse.json();
    expect(savedBooking).toEqual(updatedBooking);
});

//Rechazo de datos de entrada inválidos - POST
test('API-003 | Rechazo de una reserva sin un campo obligatorio', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    const invalidBooking = createValidBookingData();

    delete invalidBooking.firstname;

    // Act: intentar crear la reserva con datos incompletos.
    const response = await bookingApi.createBooking(invalidBooking);

    expect(response.status()).toBe(500);
});
