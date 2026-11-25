# TicketHub System Design

## 1. Introduction

TicketHub is an online ticketing website where users can view events, select seats, and purchase tickets for concerts and other events.

The system must support normal daily traffic and handle sudden increases in visitors when popular event tickets go on sale.

## 2. Requirements

### A. Functional Requirements

The system should allow users to:

1. Register and log in.
2. View available events.
3. View event details, including date, venue, and ticket prices.
4. View available and booked seats.
5. Select and temporarily hold a seat.
6. Purchase tickets using online payment.
7. Receive booking confirmation and tickets.
8. View their purchased tickets.

### B. Non-Functional Requirements

The system should provide:

- **Performance:** Pages should load quickly.
- **Scalability:** The system should handle many users at the same time.
- **Availability:** The website should remain accessible during popular ticket sales.
- **Security:** User information and payment details should be protected.
- **Reliability:** Payments and bookings should be processed correctly.
- **Consistency:** One seat must not be sold to two different users.

## 3. Traffic Estimates

TicketHub has 2 million registered users.

### A. Normal Daily Traffic

- Daily visitors: 50,000
- Each visitor views 10 pages.
- Total page views: 50,000 × 10 = 500,000 page views per day.

Average page requests per second:

500,000 ÷ 86,400 = approximately 5.79 requests per second.

Therefore, the system handles approximately 6 page requests per second during normal daily traffic.

Normal daily ticket sales:

5,000 tickets ÷ 86,400 = approximately 0.058 tickets per second.

### B. Popular Concert Sale Traffic

During a popular concert sale:

- 200,000 people try to buy tickets.
- Only 20,000 seats are available.
- The sale period is 10 minutes (600 seconds).

Average incoming visitors per second:

200,000 ÷ 600 = approximately 333.33 visitors per second.

Average ticket sales needed per second:

20,000 ÷ 600 = approximately 33.33 tickets per second.

### C. Comparison

Normal daily visitors per second:

50,000 ÷ 86,400 = 0.58 visitors per second.

During a popular concert sale:

200,000 ÷ 600 = 333.33 visitors per second.

Comparison:

333.33 ÷ 0.58 = approximately 576 times.

Therefore, the popular concert sale brings approximately 576 times more incoming visitors per second than normal daily traffic.

The system must be prepared for this sudden increase by using a waiting room, caching, load balancing, and database transactions.

## 4. API Design

An API allows the frontend and backend to communicate.

TicketHub will use the following API endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/events | Display all available events |
| GET | /api/events/{eventId} | Display details of one event |
| GET | /api/events/{eventId}/seats | Display available seats |
| POST | /api/seats/{seatId}/hold | Temporarily reserve a seat |
| POST | /api/orders | Create a ticket order |
| POST | /api/orders/{orderId}/pay | Process payment |
| GET | /api/users/{userId}/tickets | Display a user's tickets |

These endpoints allow users to browse events, reserve seats, make payments, and access their tickets.

## 5. Data Model

TicketHub will use a relational database with the following tables:

### A. Users Table

Stores information about registered users.

- user_id (Primary Key)
- full_name
- email
- password

### B. Events Table

Stores information about events.

- event_id (Primary Key)
- event_name
- event_date
- venue
- ticket_price

### C. Seats Table

Stores information about seats available for each event.

- seat_id (Primary Key)
- event_id (Foreign Key)
- seat_number
- status

### D. Orders Table

Stores ticket purchase information.

- order_id (Primary Key)
- user_id (Foreign Key)
- seat_id (Foreign Key)
- payment_status
- order_date

### Relationships

- One user can make many orders.
- One event can have many seats.
- One seat belongs to one event.
- One order belongs to one user.
- Each order is linked to the seat being purchased.

## 6. Preventing Double-Booking

TicketHub must ensure that two users cannot purchase the same seat.

I will use database transactions, row-level locking, conditional updates, and unique constraints to prevent double-booking.

### How It Works

1. A user selects a seat they want to purchase.
2. The application starts a database transaction.
3. The database locks the selected seat using row-level locking.
4. The system checks whether the seat is available or whether an existing hold has expired.
5. If the seat is available, the system changes its status to held and records the user's ID and hold expiry time.
6. The transaction is committed so that another user cannot hold the same seat.
7. The user completes payment before the hold expires.
8. After successful payment, the system starts another transaction and changes the seat status from held to sold.
9. The system creates a confirmed ticket record.
10. If payment fails or the hold expires, the seat is released and becomes available again.

### Database Constraints

- A unique constraint on (event_id, seat_number) ensures that the same seat cannot be created twice for one event.
- A unique constraint on the seat ID in the confirmed tickets table ensures that a seat cannot have two confirmed tickets.
- A conditional database update ensures that a seat can only be held when its current status is available.

If two users try to reserve the same seat at the same time, the database allows only one transaction to successfully change its status to held. The other user receives a message that the seat is no longer available.

This approach ensures that every seat is sold only once, even during a popular concert sale.

## 7. System Architecture

### Architecture Diagram

```text
              USERS
                |
                v
          CDN / CACHE
                |
                v
          WAITING ROOM
                |
                v
          LOAD BALANCER
                |
                v
          APPLICATION SERVERS
                |
                v
             API LAYER
                |
        -------------------
        |        |        |
        v        v        v
      CACHE   DATABASE  PAYMENT
              SERVER    GATEWAY
                 |
                 v
             READ REPLICA
```

### Explanation of Components

**1. Users**

Users visit the website to browse events, select seats, and purchase tickets.

**2. CDN (Content Delivery Network)**

The CDN delivers static content such as images, CSS, and JavaScript quickly to users.

**3. Cache**

The cache stores frequently requested information, such as event details, to reduce database requests.

**4. Waiting Room**

The waiting room controls the number of users entering the ticket purchasing system during a popular sale.

**5. Load Balancer**

The load balancer distributes incoming requests across multiple application servers to prevent one server from becoming overloaded.

**6. Application Servers**

Application servers process user requests and handle the main business logic.

**7. API Layer**

The API layer allows the frontend to communicate with backend services.

**8. Database Server**

The database stores users, events, seats, and orders. It ensures that ticket purchases are recorded correctly.

**9. Read Replica**

A read replica handles read requests, such as viewing events and available seats, reducing the workload on the main database.

**10. Payment Gateway**

The payment gateway processes customer payments and sends payment results back to TicketHub.

## 8. Handling High Traffic

During a popular ticket sale, TicketHub will use the following methods:

1. A waiting room will control how many users enter the system.
2. A load balancer will distribute requests across multiple servers.
3. Caching will reduce repeated database requests.
4. Database transactions will protect seat reservations.
5. Read replicas will handle additional read requests.
6. Monitoring will help identify server problems and performance issues.

These methods will help the system remain reliable during high traffic.

## 9. Design Trade-Offs

### A. Waiting Room vs Immediate Access

A waiting room controls the number of users entering the system and prevents overload. However, users may have to wait before purchasing tickets.

### B. Consistency vs Performance

Strong database consistency prevents two users from buying the same seat. However, database transactions and locking can make some operations slower.

### C. Read Replicas vs Data Freshness

Read replicas improve performance by handling many read requests. However, updates may take some time to appear on replicas, meaning some information may not be immediately up to date.

## 10. Conclusion

TicketHub requires a scalable and reliable system that can handle normal traffic and sudden increases during popular ticket sales.

By using load balancing, caching, a waiting room, database transactions, and a payment gateway, the system can provide a good user experience.

Database locking and unique constraints will also prevent double-booking and ensure that each seat is sold only once.
