-- database
USE flight_reservation;
-- SELECT queries
-- Display all flights
SELECT * FROM Flights;
-- Display only flight numbers and fares
SELECT flight_number, fare
FROM Flights;
-- WHERE clause
-- Find flights costing less than ₹5000
SELECT *
FROM Flights
WHERE fare < 5000;
-- Find flights departing from Hyderabad
SELECT *
FROM Flights
WHERE source_airport_id = 1;
-- ORDER BY
-- Display flights from lowest to highest fare
SELECT flight_number, fare
FROM Flights
ORDER BY fare ASC;
-- Display flights from highest to lowest fare
SELECT flight_number, fare
FROM Flights
ORDER BY fare DESC;
-- UPDATE query
-- Update the fare of Flight ID 1
UPDATE Flights
SET fare = 4800
WHERE flight_id = 1;
SELECT * FROM Flights
WHERE flight_id = 1;
-- DELETE query
-- Delete a passenger who is not associated with any booking
DELETE FROM Passengers
WHERE passenger_id = 4;
-- JOIN query
-- Display flight number, source airport, destination airport, and fare
SELECT
    F.flight_number,
    A1.city AS Source,
    A2.city AS Destination,
    F.fare
FROM Flights F
JOIN Airports A1
    ON F.source_airport_id = A1.airport_id
JOIN Airports A2
    ON F.destination_airport_id = A2.airport_id;
-- Aggregate functions
-- COUNT – Total number of flights
SELECT COUNT(*) AS Total_Flights
FROM Flights;
-- SUM – Total booking amount
SELECT SUM(total_amount) AS Total_Revenue
FROM Bookings
WHERE booking_status = 'Confirmed';
-- AVG – Average flight fare
SELECT AVG(fare) AS Average_Fare
FROM Flights;
-- MAX – Highest flight fare
SELECT MAX(fare) AS Highest_Fare
FROM Flights;
-- MIN – Lowest flight fare
SELECT MIN(fare) AS Lowest_Fare
FROM Flights;
-- Subquery
-- Find flights with a fare greater than the average fare
SELECT *
FROM Flights
WHERE fare > (
    SELECT AVG(fare)
    FROM Flights
);
-- create a view that displays flight details with airport names
CREATE VIEW Flight_Details AS
SELECT
    F.flight_id,
    F.flight_number,
    A1.airport_name AS Source_Airport,
    A2.airport_name AS Destination_Airport,
    F.departure_time,
    F.arrival_time,
    F.fare
FROM Flights F
JOIN Airports A1
    ON F.source_airport_id = A1.airport_id
JOIN Airports A2
    ON F.destination_airport_id = A2.airport_id;
SELECT * FROM Flight_Details;
-- Create a procedure to search for flights between two airports
DELIMITER //

CREATE PROCEDURE Search_Flights(
    IN source_code CHAR(3),
    IN destination_code CHAR(3)
)
BEGIN
    SELECT
        F.flight_number,
        A1.city AS Source,
        A2.city AS Destination,
        F.departure_time,
        F.arrival_time,
        F.fare
    FROM Flights F
    JOIN Airports A1
        ON F.source_airport_id = A1.airport_id
    JOIN Airports A2
        ON F.destination_airport_id = A2.airport_id
    WHERE A1.airport_code = source_code
      AND A2.airport_code = destination_code;
END //

DELIMITER ;
CALL Search_Flights('HYD', 'DEL');
-- Check Seat Availability
-- Create a query to display available seats for a particular flight
SELECT
    flight_id,
    seat_number,
    seat_class,
    seat_status
FROM Flight_Seats
WHERE flight_id = 1
  AND seat_status = 'Available';
-- Book a Seat
-- To book an available seat, update its status
UPDATE Flight_Seats
SET seat_status = 'Booked'
WHERE seat_id = 1
  AND seat_status = 'Available';
SELECT * FROM Flight_Seats
WHERE seat_id = 1;
