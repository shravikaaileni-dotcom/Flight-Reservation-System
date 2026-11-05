
// ======================================
// SKYBOOK - FLIGHT RESERVATION SYSTEM
// ======================================

// 1. Read URL parameters
const params = new URLSearchParams(window.location.search);

// 2. Filter flights by route and travel class
const selectedClass = params.get("class") || "Economy";
const selectedSource = params.get("source") || "";
const selectedDestination = params.get("destination") || "";

const classDisplay = document.getElementById("class-display");

if (classDisplay) {
    classDisplay.textContent = selectedClass;
}

const flightCards = document.querySelectorAll(".flight-card");

let visibleEconomy = 0;
let visibleFirstClass = 0;

flightCards.forEach(function (card) {
    const flightLink = card.querySelector(".select-btn");

    if (flightLink) {
        const flightClass = flightLink.dataset.class;
        const flightSource = card.dataset.source;
        const flightDestination = card.dataset.destination;

        const classMatches = flightClass === selectedClass;
        const routeMatches =
            flightSource === selectedSource &&
            flightDestination === selectedDestination;

        if (classMatches && routeMatches) {
            card.style.display = "flex";

            if (flightClass === "Economy") {
                visibleEconomy++;
            } else if (flightClass === "First Class") {
                visibleFirstClass++;
            }
        } else {
            card.style.display = "none";
        }
    }
});

// Show or hide class headings
const economyHeading = document.getElementById("economy-heading");
const firstClassHeading = document.getElementById("first-class-heading");

if (economyHeading) {
    economyHeading.style.display =
        visibleEconomy > 0 ? "block" : "none";
}

if (firstClassHeading) {
    firstClassHeading.style.display =
        visibleFirstClass > 0 ? "block" : "none";
}

// No flights message
const noFlightsMessage = document.getElementById("no-flights-message");

if (noFlightsMessage) {
    noFlightsMessage.style.display =
        visibleEconomy + visibleFirstClass === 0 ? "block" : "none";
}

// 3. Display search details
const sourceElement = document.getElementById("source-display");
const destinationElement = document.getElementById("destination-display");
const dateElement = document.getElementById("travel-date");
const passengersElement = document.getElementById("passenger-count");

if (sourceElement) {
    sourceElement.textContent = params.get("source") || "Not selected";
}

if (destinationElement) {
    destinationElement.textContent = params.get("destination") || "Not selected";
}

if (dateElement) {
    dateElement.textContent = params.get("date") || "Not selected";
}

if (passengersElement) {
    passengersElement.textContent = params.get("passengers") || "1";
}

// 4. Prevent past departure dates
const dateInput = document.getElementById("date");

if (dateInput) {
    const today = new Date();

    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    dateInput.min = localDate;
}

// 5. Validate flight search form
const searchForm = document.querySelector(".search-form");

if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
        const source = document.getElementById("source").value;
        const destination = document.getElementById("destination").value;

        if (source === destination) {
            event.preventDefault();
            alert("From and To cities cannot be the same!");
        }
    });
}

// 6. Pass selected flight details to Passenger page
const flightLinks = document.querySelectorAll(".select-btn");

flightLinks.forEach(function (link) {
    if (link.dataset.flight) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const bookingParams =
                new URLSearchParams(window.location.search);

            bookingParams.set("flight", link.dataset.flight || "");
            bookingParams.set("airline", link.dataset.airline || "");
            bookingParams.set("class", link.dataset.class || "Economy");
            bookingParams.set("fare", link.dataset.fare || "");
            bookingParams.set("departure", link.dataset.departure || "");
            bookingParams.set("arrival", link.dataset.arrival || "");

            window.location.href =
                "passenger.html?" + bookingParams.toString();
        });
    }
});

// 7. Display selected flight on Passenger page
const passengerFlightParams =
    new URLSearchParams(window.location.search);

const flightElement = document.getElementById("flight-number");

if (flightElement) {
    flightElement.textContent =
        passengerFlightParams.get("flight") || "Not selected";
}

// 8. Seat Selection
const seatLayout = document.getElementById("seat-layout");
const selectedSeatsDisplay =
    document.getElementById("selected-seats");
const seatInstruction =
    document.getElementById("seat-instruction");

let selectedSeats = [];

if (seatLayout) {
    const flightNumber = passengerFlightParams.get("flight");
    const travelDate = passengerFlightParams.get("date");

    const passengerCount = Number(
        passengerFlightParams.get("passengers") || 1
    );

    const existingBookings = JSON.parse(
        localStorage.getItem("skybookBookings") || "[]"
    );

    const bookedSeats = existingBookings
        .filter(function (booking) {
            return (
                booking.flight === flightNumber &&
                booking.date === travelDate &&
                booking.status !== "Cancelled"
            );
        })
        .flatMap(function (booking) {
            return booking.seats || [];
        });

    if (seatInstruction) {
        seatInstruction.textContent =
            "Select " + passengerCount + " seat(s) for your journey.";
    }

    for (let row = 1; row <= 5; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";

        ["A", "B", "C", "D", "E", "F"].forEach(function (letter) {
            const seatNumber = row + letter;
            const seat = document.createElement("button");

            seat.type = "button";
            seat.textContent = seatNumber;
            seat.className = "seat";

            if (bookedSeats.includes(seatNumber)) {
                seat.classList.add("booked");
                seat.disabled = true;
            }

            seat.addEventListener("click", function () {
                if (selectedSeats.includes(seatNumber)) {
                    selectedSeats = selectedSeats.filter(
                        function (item) {
                            return item !== seatNumber;
                        }
                    );

                    seat.classList.remove("selected");
                } else {
                    if (selectedSeats.length >= passengerCount) {
                        alert(
                            "You can select only " +
                            passengerCount + " seats."
                        );
                        return;
                    }

                    selectedSeats.push(seatNumber);
                    seat.classList.add("selected");
                }

                if (selectedSeatsDisplay) {
                    selectedSeatsDisplay.textContent =
                        selectedSeats.length > 0
                            ? selectedSeats.join(", ")
                            : "None";
                }
            });

            rowDiv.appendChild(seat);
        });

        seatLayout.appendChild(rowDiv);
    }
}

// 9. Handle Passenger Form Submission
const passengerForm = document.getElementById("passenger-form");

if (passengerForm) {
    passengerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const passengerCount = Number(
            passengerFlightParams.get("passengers") || 1
        );

        if (selectedSeats.length !== passengerCount) {
            alert(
                "Please select exactly " +
                passengerCount + " seat(s)."
            );
            return;
        }

        const name =
            document.getElementById("passenger-name").value.trim();

        const age =
            document.getElementById("passenger-age").value;

        const gender =
            document.getElementById("passenger-gender").value;

        const email =
            document.getElementById("passenger-email").value.trim();

        const flightParams =
            new URLSearchParams(window.location.search);

        const booking = {
            bookingId: "SB" + Date.now(),

            name: name,
            age: age,
            gender: gender,
            email: email,

            flight: flightParams.get("flight") || "Not selected",
            airline: flightParams.get("airline") || "Not selected",
            travelClass: flightParams.get("class") || "Economy",

            fare: Number(flightParams.get("fare") || 0),

            totalFare:
                Number(flightParams.get("fare") || 0) *
                passengerCount,

            departure: flightParams.get("departure") || "Not available",
            arrival: flightParams.get("arrival") || "Not available",

            source: flightParams.get("source") || "Not selected",
            destination: flightParams.get("destination") || "Not selected",
            date: flightParams.get("date") || "Not selected",

            passengers: passengerCount,
            seats: selectedSeats,

            status: "Confirmed"
        };

        // Save booking
        const bookings = JSON.parse(
            localStorage.getItem("skybookBookings") || "[]"
        );

        bookings.push(booking);

        localStorage.setItem(
            "skybookBookings",
            JSON.stringify(bookings)
        );

        // Move to Confirmation page
        const bookingDetails = new URLSearchParams();

        Object.keys(booking).forEach(function (key) {
            bookingDetails.set(
                key,
                Array.isArray(booking[key])
                    ? booking[key].join(", ")
                    : booking[key]
            );
        });

        window.location.href =
            "confirmation.html?" + bookingDetails.toString();
    });
}

// 10. Display and Cancel Bookings
const bookingList = document.getElementById("booking-list");

if (bookingList) {
    function displayBookings() {
        const bookings = JSON.parse(
            localStorage.getItem("skybookBookings") || "[]"
        );

        bookingList.innerHTML = "<h3>Your Reservations</h3>";

        if (bookings.length === 0) {
            bookingList.innerHTML +=
                "<p>No bookings found. Complete a flight booking to see it here.</p>";
            return;
        }

        bookings.forEach(function (booking) {
            const card = document.createElement("div");
            card.className = "search-summary";

            const details = [
                ["Booking ID", booking.bookingId],
                ["Passenger", booking.name],
                ["Age", booking.age],
                ["Gender", booking.gender],
                ["Email", booking.email],
                ["Flight Number", booking.flight],
                ["Airline", booking.airline],
                ["Travel Class", booking.travelClass],
                [
                    "Fare per Passenger",
                    booking.fare ? "₹" + booking.fare : "Not available"
                ],
                [
                    "Total Fare",
                    "₹" + (
                        Number(booking.fare || 0) *
                        Number(booking.passengers || 1)
                    )
                ],
                ["From", booking.source],
                ["To", booking.destination],
                ["Travel Date", booking.date],
                ["Passengers", booking.passengers],
                [
                    "Selected Seats",
                    (booking.seats || []).join(", ") || "Not selected"
                ],
                ["Status", booking.status || "Pending Confirmation"]
            ];

            const heading = document.createElement("h3");
            heading.textContent = "Booking Details";
            card.appendChild(heading);

            details.forEach(function (item) {
                const paragraph = document.createElement("p");

                paragraph.textContent =
                    item[0] + ": " + (item[1] || "Not available");

                card.appendChild(paragraph);
            });

            // Cancel button only for active bookings
            if (booking.status !== "Cancelled") {
                const cancelButton = document.createElement("button");

                cancelButton.textContent = "Cancel Booking";
                cancelButton.className = "cancel-btn";

                cancelButton.addEventListener("click", function () {
                    const confirmCancel = confirm(
                        "Are you sure you want to cancel this booking?"
                    );

                    if (confirmCancel) {
                        const updatedBookings = bookings.map(
                            function (item) {
                                if (item.bookingId === booking.bookingId) {
                                    return {
                                        ...item,
                                        status: "Cancelled"
                                    };
                                }

                                return item;
                            }
                        );

                        localStorage.setItem(
                            "skybookBookings",
                            JSON.stringify(updatedBookings)
                        );

                        displayBookings();
                    }
                });

                card.appendChild(cancelButton);
            }

            bookingList.appendChild(card);
        });
    }

    displayBookings();
}

// 11. Display Booking Details on Confirmation Page
const confirmationParams =
    new URLSearchParams(window.location.search);

const confirmationFields = {
    "confirm-name": "name",
    "confirm-age": "age",
    "confirm-gender": "gender",
    "confirm-email": "email",
    "confirm-flight": "flight",
    "confirm-seats": "seats",
    "confirm-status": "status"
};

Object.keys(confirmationFields).forEach(function (elementId) {
    const element = document.getElementById(elementId);

    if (element) {
        element.textContent =
            confirmationParams.get(confirmationFields[elementId]) || "-";
    }
});

// 12. Download SKYBOOK E-TICKET
const downloadButton = document.getElementById("download-ticket");

if (downloadButton) {
    downloadButton.addEventListener("click", function () {
        const ticketDetails =
            document.querySelector(".confirmation-details");

        if (!ticketDetails) {
            alert("Ticket details not found.");
            return;
        }

        const ticketContent = `
SKYBOOK AIRLINES
========================
          E-TICKET
========================

${ticketDetails.innerText}

========================
Thank you for booking with SkyBook!
Please arrive at the airport early.
========================
        `;

        const file = new Blob([ticketContent], {
            type: "text/plain"
        });

        const fileURL = URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "SkyBook-E-Ticket.txt";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(fileURL);
    });
}
