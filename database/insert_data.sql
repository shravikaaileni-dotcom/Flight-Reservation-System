USE flight_reservation;

SHOW TABLES;

INSERT INTO Airports
(airport_name, airport_code, city, country)
VALUES
('Rajiv Gandhi International Airport', 'HYD',
 'Hyderabad', 'India'),

('Indira Gandhi International Airport', 'DEL',
 'Delhi', 'India'),

('Kempegowda International Airport', 'BLR',
 'Bengaluru', 'India'),

('Chennai International Airport', 'MAA',
 'Chennai', 'India'),

('Chhatrapati Shivaji Maharaj International Airport',
 'BOM', 'Mumbai', 'India');

INSERT INTO Aircraft
(airline_name, aircraft_model,
 registration_number, total_seats)
VALUES
('IndiGo', 'Airbus A320', 'VT-IGA', 180),

('Air India', 'Boeing 737', 'VT-AIA', 150),

('IndiGo', 'Airbus A321', 'VT-IGB', 200);

INSERT INTO Flights
(flight_number, aircraft_id,
 source_airport_id, destination_airport_id,
 departure_time, arrival_time, fare)
VALUES
('6E501', 1, 1, 2,
 '2026-11-10 09:00:00',
 '2026-11-10 11:15:00', 4500.00),

('AI202', 2, 2, 3,
 '2026-11-10 12:00:00',
 '2026-11-10 14:30:00', 5500.00),

('6E305', 3, 1, 4,
 '2026-11-11 08:00:00',
 '2026-11-11 09:30:00', 3500.00),

('6E410', 1, 3, 5,
 '2026-11-12 10:00:00',
 '2026-11-12 12:00:00', 4000.00);

INSERT INTO Users
(full_name, email, password_hash, phone)
VALUES
('Rahul Kumar', 'rahul@gmail.com',
 'demo_hash_rahul', '9876543210'),

('Priya Sharma', 'priya@gmail.com',
 'demo_hash_priya', '9876543211'),

('Arjun Reddy', 'arjun@gmail.com',
 'demo_hash_arjun', '9876543212');

INSERT INTO Passengers
(full_name, age, gender, passport_number, phone)
VALUES
('Rahul Kumar', 22, 'Male', 'P100001', '9876543210'),

('Priya Sharma', 21, 'Female', 'P100002', '9876543211'),

('Arjun Reddy', 23, 'Male', 'P100003', '9876543212'),

('Sneha Rao', 20, 'Female', 'P100004', '9876543213');

INSERT INTO Flight_Seats
(flight_id, seat_number, seat_class)
VALUES
(1, '1A', 'Economy'),
(1, '1B', 'Economy'),
(1, '1C', 'Economy'),
(1, '2A', 'Economy'),
(1, '2B', 'Economy'),
(1, '2C', 'Economy');

INSERT INTO Bookings
(user_id, flight_id, total_amount, booking_status)
VALUES
(1, 1, 4500.00, 'Confirmed'),

(2, 1, 9000.00, 'Confirmed'),

(3, 2, 5500.00, 'Confirmed');

SELECT * FROM Flight_Seats;

INSERT INTO Booking_Passengers
(booking_id, passenger_id, seat_id)
VALUES
(1, 1, 1),
(2, 2, 2),
(2, 4, 3),
(3, 3, 4);

INSERT INTO Payments
(booking_id, payment_method,
 payment_amount, payment_status, transaction_id)
VALUES
(1, 'UPI', 4500.00, 'Successful', 'TXN1001'),

(2, 'Credit Card', 9000.00,
 'Successful', 'TXN1002'),

(3, 'Net Banking', 5500.00,
 'Pending', 'TXN1003');