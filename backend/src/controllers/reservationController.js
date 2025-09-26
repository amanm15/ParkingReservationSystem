import { initDb } from '../database.js'

export const getAllReservations = async (req, res) => {
  try {
    const db = await initDb()
    const reservations = await db.all('SELECT * FROM reservations')
    res.json(reservations)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    res.status(500).json({ error: 'Failed to fetch reservations' })
  }
}

export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params
    const db = await initDb()
    const reservation = await db.get('SELECT * FROM reservations WHERE id = ?', [id])

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    res.json(reservation)
  } catch (error) {
    console.error('Error fetching reservation:', error)
    res.status(500).json({ error: 'Failed to fetch reservation' })
  }
}

export const createReservation = async (req, res) => {
  try {
    const { name, licensePlate, spotNumber, date } = req.body

    // Validation
    if (!name || !licensePlate || !spotNumber || !date) {
      return res.status(400).json({
        error: 'Missing required fields: name, licensePlate, spotNumber, date'
      })
    }

    // Basic format validation
    if (typeof spotNumber !== 'number' || spotNumber <= 0) {
      return res.status(400).json({
        error: 'Spot number must be a positive number'
      })
    }

    const db = await initDb()

    // Check if spot is already reserved for that date
    const existingSpotReservation = await db.get(
      'SELECT * FROM reservations WHERE spotNumber = ? AND date = ?',
      [spotNumber, date]
    )

    if (existingSpotReservation) {
      return res.status(409).json({
        error: 'Parking spot is already reserved for this date'
      })
    }

    const existingLicenseReservation = await db.get(
      'SELECT * FROM reservations WHERE licensePlate = ? AND date = ?',
      [licensePlate, date]
    )

    if (existingLicenseReservation) {
      return res.status(409).json({
        error: 'This license plate already has a reservation for this date'
      })
    }

    const result = await db.run(
      'INSERT INTO reservations (name, licensePlate, spotNumber, date) VALUES (?, ?, ?, ?)',
      [name, licensePlate, spotNumber, date]
    )

    res.status(201).json({
      message: 'Reservation created successfully',
      reservationId: result.lastID
    })
  } catch (error) {
    console.error('Error creating reservation:', error)
    res.status(500).json({ error: 'Failed to create reservation' })
  }
}

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params
    const { name, licensePlate, spotNumber, date } = req.body

    const db = await initDb()

    // Check if reservation exists
    const existing = await db.get('SELECT * FROM reservations WHERE id = ?', [id])
    if (!existing) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    const result = await db.run(
      'UPDATE reservations SET name = ?, licensePlate = ?, spotNumber = ?, date = ? WHERE id = ?',
      [name, licensePlate, spotNumber, date, id]
    )

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    res.json({ message: 'Reservation updated successfully' })
  } catch (error) {
    console.error('Error updating reservation:', error)
    res.status(500).json({ error: 'Failed to update reservation' })
  }
}

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params
    const db = await initDb()

    const result = await db.run('DELETE FROM reservations WHERE id = ?', [id])

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    res.json({ message: 'Reservation deleted successfully' })
  } catch (error) {
    console.error('Error deleting reservation:', error)
    res.status(500).json({ error: 'Failed to delete reservation' })
  }
}
