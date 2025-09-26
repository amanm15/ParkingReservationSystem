/* eslint-env jest */
import request from 'supertest'
import app from '../server.js' // if you export your Express app

describe('Reservations API', () => {
  it('should create a new reservation', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ name: 'Doe', licensePlate: 'ABC1234', spotNumber: 2, date: '2025-09-25' })

    expect(res.statusCode).toBe(201)
    expect(res.body.message).toBe('Reservation created successfully')
  })

  it('should fetch reservations', async () => {
    const res = await request(app).get('/api/reservations')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('should fetch all reservations', async () => {
    await request(app).post('/api/reservations').send({
      name: 'Bob',
      licensePlate: 'XYZ789',
      spotNumber: 2,
      date: '2025-09-25'
    })

    const res = await request(app).get('/api/reservations')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })

  it('should fetch a reservation by ID', async () => {
    const createRes = await request(app).post('/api/reservations').send({
      name: 'Charlie',
      licensePlate: 'LMN456',
      spotNumber: 3,
      date: '2025-09-26'
    })

    const reservationId = createRes.body.reservationId

    const res = await request(app).get(`/api/reservations/${reservationId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe('Charlie')
  })

  it('should return 404 if reservation not found by ID', async () => {
    const res = await request(app).get('/api/reservations/9999')
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Reservation not found')
  })

  it('should update a reservation', async () => {
    const createRes = await request(app).post('/api/reservations').send({
      name: 'David',
      licensePlate: 'PQR111',
      spotNumber: 4,
      date: '2025-09-27'
    })

    const reservationId = createRes.body.reservationId

    const updateRes = await request(app)
      .put(`/api/reservations/${reservationId}`)
      .send({
        name: 'David Updated',
        licensePlate: 'PQR111',
        spotNumber: 5,
        date: '2025-09-27'
      })

    expect(updateRes.statusCode).toBe(200)
    expect(updateRes.body.message).toBe('Reservation updated successfully')
  })

  it('should delete a reservation', async () => {
    const createRes = await request(app).post('/api/reservations').send({
      name: 'Eve',
      licensePlate: 'DEL999',
      spotNumber: 6,
      date: '2025-09-28'
    })

    const reservationId = createRes.body.reservationId

    const deleteRes = await request(app).delete(`/api/reservations/${reservationId}`)
    expect(deleteRes.statusCode).toBe(200)
    expect(deleteRes.body.message).toBe('Reservation deleted successfully')
  })

  it('should return 404 when deleting a non-existent reservation', async () => {
    const res = await request(app).delete('/api/reservations/9999')
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Reservation not found')
  })
})
