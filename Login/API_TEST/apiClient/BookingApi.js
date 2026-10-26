// Separo la lógica de la conexión con la lógica de pruebas

const BASE_URL = 'https://restful-booker.herokuapp.com';

class BookingApi {
    constructor(request) {
        this.request = request;
        this.baseUrl = BASE_URL;
    }

    //Endpoints
    async createBooking(bookingData) {
        return await this.request.post(`${this.baseUrl}/booking`, {
            data: bookingData
        });
    }

    async getBooking(bookingId) {
        return await this.request.get(
            `${this.baseUrl}/booking/${bookingId}`
        );
    }

    async createToken(username, password) {
        return await this.request.post(`${this.baseUrl}/auth`, {
            data: {
                username,
                password
            }
        });
    }

    async updateBooking(bookingId, bookingData, token) {
        return await this.request.put(
            `${this.baseUrl}/booking/${bookingId}`,
            {
                data: bookingData,
                headers: {
                    Cookie: `token=${token}`
                }
            }
        );
    }
}

export default BookingApi;
