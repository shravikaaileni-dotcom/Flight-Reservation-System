CREATE DATABASE flight_reservation;
USE flight_reservation;
SHOW DATABASES;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Airports (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_name VARCHAR(100) NOT NULL,
    airport_code CHAR(3) NOT NULL UNIQUE,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL
);

CREATE TABLE Aircraft (
    aircraft_id INT AUTO_INCREMENT PRIMARY KEY,
    airline_name VARCHAR(100) NOT NULL,
    aircraft_model VARCHAR(100) NOT NULL,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    total_seats INT NOT NULL,
    CHECK (total_seats > 0)
);

CREATE TABLE Flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    aircraft_id INT NOT NULL,
    source_airport_id INT NOT NULL,
    destination_airport_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    fare DECIMAL(10,2) NOT NULL,
    flight_status VARCHAR(20) DEFAULT 'Scheduled',

    FOREIGN KEY (aircraft_id)
        REFERENCES Aircraft(aircraft_id),

    FOREIGN KEY (source_airport_id)
        REFERENCES Airports(airport_id),

    FOREIGN KEY (destination_airport_id)
        REFERENCES Airports(airport_id),

    CHECK (fare >= 0),
    CHECK (source_airport_id <> destination_airport_id),
    CHECK (arrival_time > departure_time)
);

CREATE TABLE Flight_Seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    seat_class VARCHAR(20) DEFAULT 'Economy',
    seat_status VARCHAR(20) DEFAULT 'Available',

    FOREIGN KEY (flight_id)
        REFERENCES Flights(flight_id),

    UNIQUE (flight_id, seat_number),

    CHECK (seat_status IN
        ('Available', 'Booked', 'Blocked'))
);

CREATE TABLE Passengers (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20),
    passport_number VARCHAR(30) UNIQUE,
    phone VARCHAR(15),

    CHECK (age > 0)
);

CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'Confirmed',

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id),

    FOREIGN KEY (flight_id)
        REFERENCES Flights(flight_id),

    CHECK (total_amount >= 0),

    CHECK (booking_status IN
        ('Confirmed', 'Cancelled', 'Pending'))
);

CREATE TABLE Booking_Passengers (
    booking_passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    passenger_id INT NOT NULL,
    seat_id INT NOT NULL,

    FOREIGN KEY (booking_id)
        REFERENCES Bookings(booking_id),

    FOREIGN KEY (passenger_id)
        REFERENCES Passengers(passenger_id),

    FOREIGN KEY (seat_id)
        REFERENCES Flight_Seats(seat_id),

    UNIQUE (booking_id, passenger_id),
    UNIQUE (seat_id)
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) DEFAULT 'Pending',
    transaction_id VARCHAR(100) UNIQUE,

    FOREIGN KEY (booking_id)
        REFERENCES Bookings(booking_id),

    CHECK (payment_amount >= 0),

    CHECK (payment_status IN
        ('Pending', 'Successful', 'Failed', 'Refunded'))
);
















