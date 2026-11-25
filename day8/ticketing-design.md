
# Day 8 Assignment: Design an Event Ticketing System

## 1. Introduction

TicketHub is an online ticketing website where users can browse events, view available seats, reserve seats, make payments, and access their purchased tickets.

The system must support millions of registered users and handle sudden increases in traffic when popular concerts go on sale.

The main goal is to build a reliable, secure, fair, and scalable ticketing system that prevents double-booking.

## 2. Requirements

### A. Functional Requirements

The system must allow users to:

1. Register and log in to their accounts.
2. Browse upcoming concerts and other events.
3. Search for events by name, location, and date.
4. View event details, ticket prices, and available seats.
5. Select and temporarily hold available seats.
6. Make payments for reserved seats.
7. Receive confirmation after successful payment.
8. View their purchased tickets.
9. Cancel orders when cancellation is allowed.
10. Receive notifications about successful purchases.

### B. Non-Functional Requirements

**1. Performance:** Event pages should load quickly, and seat availability should be displayed with minimal delay.

**2. Scalability:** The system should support normal daily traffic and sudden traffic increases during popular concert sales.

**3. Availability:** The system should remain available even when some application servers fail.

**4. Correctness and Consistency:** A seat must never be sold to two different customers. Payments and orders must be recorded accurately.

**5. Security:** User accounts and payment information must be protected using authentication, authorization, and secure communication.

**6. Fairness:** During popular sales, users should enter through a waiting room that controls access fairly and prevents users from overwhelming the system.

**7. Reliability:** Failed requests and payment interruptions should not result in lost orders or incorrect seat availability.

## 3. Traffic and Storage Estimates

The system has the following information:

- Registered users: 2 million.
- Normal daily visitors: 50,000.
- Each visitor views 10 pages per day.
- Normal ticket sales: 5,000 per day.
- Popular concert sale: 200,000 people attempt to buy 20,000 seats within 10 minutes.

There are 86,400 seconds in one day and 600 seconds in 10 minutes.

### A. Normal Daily Traffic

**1. Daily page views**

50,000 visitors × 10 pages = 500,000 page views per day.

**2. Average page views per second**

500,000 ÷ 86,400 = 5.79 page views per second.

Therefore, normal traffic is approximately 6 page views per second on average.

**3. Normal ticket sales per second**

5,000 ÷ 86,400 = 0.058 ticket sales per second.

This is approximately 5,000 ticket sales per day.

### B. Popular Concert Sale Traffic

**1. Purchase attempts per second**

200,000 people ÷ 600 seconds = 333.33 attempts per second.

Therefore, the system must handle approximately 333 purchase attempts per second during the sale.

**2. Tickets available per second**

20,000 seats ÷ 600 seconds = 33.33 seats per second.

The system can sell a maximum of 20,000 seats during this sale.

**3. Percentage of users who can get tickets**

20,000 ÷ 200,000 × 100 = 10%.

Only 10% of the people attempting to buy tickets can successfully purchase one if each person wants one seat.

### C. Comparing Normal Traffic and Peak Traffic

The normal daily visitor arrival rate is:

50,000 ÷ 86,400 = 0.579 visitors per second.

The popular sale arrival rate is:

200,000 ÷ 600 = 333.33 visitors per second.

Traffic increase:

333.33 ÷ 0.579 = approximately 576 times.

Therefore, the popular concert sale creates approximately 576 times the normal visitor arrival rate.

This means TicketHub needs a waiting room, caching, multiple application servers, and a scalable database to handle the sudden increase in traffic.

## 4. API Design

An API allows the frontend application to communicate with the backend system.

The following endpoints support the main user activities.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/events | Browse available events |
| GET | /api/events/{eventId} | View details of a specific event |
| GET | /api/events/{eventId}/seats | View available seats |
| POST | /api/seats/{seatId}/hold | Temporarily reserve a seat |
| POST | /api/orders | Create an order for held seats |
| POST | /api/payments | Process payment for an order |
| GET | /api/orders/{orderId} | View order details |
| GET | /api/tickets | View purchased tickets |

### API Explanation

1. **GET /api/events:** Returns a list of upcoming events.

2. **GET /api/events/{eventId}:** Returns information about a selected event, including its date, location, and ticket prices.

3. **GET /api/events/{eventId}/seats:** Displays the seats available for a particular event.

4. **POST /api/seats/{seatId}/hold:** Requests a temporary hold on a selected seat. The system checks availability before creating the hold.

5. **POST /api/orders:** Creates an order using the user's held seats.

6. **POST /api/payments:** Sends a payment request to the payment provider and records the payment result.

7. **GET /api/orders/{orderId}:** Allows a user to check the status of an order.

8. **GET /api/tickets:** Displays the tickets successfully purchased by the logged-in user.

All purchasing endpoints require authentication. The system also uses unique request identifiers for important operations to prevent duplicate orders and payments when users retry requests.

## 5. Data Model

TicketHub uses a relational database because ticket purchases require accurate relationships and transactions.

The main tables are Users, Events, Seats, Orders, and Payments.

### A. Users Table

Stores information about registered customers.

| Column | Description |
|---|---|
| user_id (PK) | Unique user identifier |
| full_name | Customer's name |
| email | Customer's email address |
| password_hash | Securely stored password hash |
| created_at | Account creation date |

### B. Events Table

Stores information about concerts and other events.

| Column | Description |
|---|---|
| event_id (PK) | Unique event identifier |
| event_name | Name of the event |
| location | Event venue |
| event_date | Date of the event |
| description | Event information |

### C. Seats Table

Stores the seats available for each event.

| Column | Description |
|---|---|
| seat_id (PK) | Unique seat identifier |
| event_id (FK) | References Events |
| seat_number | Seat identification number |
| price | Ticket price |
| status | Available, Held, or Sold |
| held_by (FK) | User currently holding the seat |
| hold_expires_at | Time when the temporary hold expires |

A unique constraint on event_id and seat_number ensures that the same physical seat is not entered twice for one event.

### D. Orders Table

Stores customer ticket orders.

| Column | Description |
|---|---|
| order_id (PK) | Unique order identifier |
| user_id (FK) | References Users |
| total_amount | Total order amount |
| order_status | Pending, Paid, or Cancelled |
| created_at | Order creation date |

### E. Payments Table

Stores payment information.

| Column | Description |
|---|---|
| payment_id (PK) | Unique payment identifier |
| order_id (FK) | References Orders |
| payment_reference | Unique payment reference |
| amount | Amount paid |
| payment_status | Pending, Successful, or Failed |
| paid_at | Payment date and time |

### Relationships Between Tables

1. One user can create many orders.
2. One event can have many seats.
3. One user can temporarily hold seats.
4. One order can contain one or more seats. An order_seats linking table connects orders and seats when multiple seats are purchased together.
5. One order can have payment attempts recorded in the Payments table.

The foreign keys maintain relationships between the tables and help protect data integrity.

## 6. Preventing Double-Booking

Double-booking happens when two different customers successfully purchase the same seat.

TicketHub prevents this by using database transactions, row-level locking, conditional updates, and unique constraints.

### How It Works

1. A customer selects a seat.
2. The application sends a request to the primary database.
3. The database checks whether the seat is available.
4. A transaction locks the selected seat row.
5. The database changes the seat status from Available to Held only if it is still available.
6. The system records the user holding the seat and the hold expiration time.
7. If another customer tries to hold the same seat, the database will not allow the second request to change the already-held seat.
8. The first customer completes payment within the allowed holding period.
9. After successful payment, the system changes the seat status from Held to Sold.
10. If the hold expires without successful payment, the seat becomes Available again.

### Example of a Conditional Update

```sql
UPDATE Seats
SET status = 'Held',
    held_by = 101,
    hold_expires_at = CURRENT_TIMESTAMP + INTERVAL '10 minutes'
WHERE seat_id = 25
  AND status = 'Available';
```

The application checks the number of rows updated.

- If one row is updated, the seat has been successfully held.
- If zero rows are updated, the seat is no longer available and the customer must select another seat.

The database transaction ensures that two customers cannot successfully hold the same seat at the same time.

The system also uses a unique constraint on the event and seat combination to prevent duplicate seat records.

Payment confirmation and changing the seat to Sold must be handled safely so that a seat is not sold before payment is confirmed. If payment fails or the hold expires, the reservation is released according to the payment and hold rules.

This approach protects customers from purchasing seats that have already been reserved or sold.

## 7. System Architecture

TicketHub uses a scalable architecture to handle normal traffic and large ticket-sale events.

### Architecture Diagram

```text
                         USERS
                           |
                           v
                          CDN
                           |
                           v
                     WAITING ROOM
                           |
                           v
                     LOAD BALANCER
                           |
                +----------+----------+
                |          |          |
                v          v          v
             APP       APP SERVER   APP
           SERVER                  SERVER
                |          |          |
                +----------+----------+
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
           CACHE      PRIMARY DATABASE  PAYMENT
                      (Users, Events,   SERVICE
                       Seats, Orders,
                       Payments)
                           |
                           v
                     READ REPLICA
```

### Explanation of Each Component

**1. CDN (Content Delivery Network)**

The CDN delivers static content such as event posters, images, CSS, and JavaScript from servers closer to users. This reduces the workload on the main application.

**2. Waiting Room**

The waiting room controls how many users enter the ticket purchasing system during a popular concert sale. It places users in a queue and allows a limited number to proceed at a time. It helps prevent overload and promotes fair access.

**3. Load Balancer**

The load balancer distributes incoming requests across several application servers so that no single server handles all the traffic.

**4. Application Servers**

Application servers process user requests such as browsing events, viewing seats, holding seats, placing orders, and checking tickets. Multiple servers allow the system to handle more users.

**5. Cache**

The cache stores frequently accessed information, such as popular event details and seat availability summaries. It reduces repeated database queries and improves response time. However, the database remains the final authority for seat availability.

**6. Primary Relational Database**

The primary database stores users, events, seats, orders, and payments. It uses transactions, row-level locking, and constraints to prevent two customers from buying the same seat.

**7. Database Read Replica**

The read replica handles read-only requests such as browsing event information. This reduces the reading workload on the primary database. Seat holds and purchases are handled by the primary database to maintain consistency.

**8. Payment Service**

The payment service communicates with the payment provider to process payments. It verifies payment results before confirming an order. Unique payment references help prevent duplicate payment processing.

### How the Architecture Handles a Popular Concert Sale

When 200,000 people attempt to buy 20,000 tickets within ten minutes, the waiting room controls how many users enter the application at once.

The CDN serves static content without sending every request to the application servers. The load balancer distributes requests across multiple application servers.

The cache provides frequently requested event information quickly, while the database read replica handles browsing requests.

When a user selects a seat, the application server sends a request to the primary database. The database uses a transaction and row-level lock to ensure that only one user can hold a particular seat at a time.

The payment service processes the payment. Once payment is confirmed, the database updates the order and marks the seat as Sold.

This architecture reduces overload, protects seat availability, and allows TicketHub to handle high traffic while maintaining accurate ticket records.

## 8. Design Trade-Offs

A design trade-off occurs when improving one part of a system creates a disadvantage in another part. TicketHub must make decisions that balance performance, cost, correctness, and reliability.

### Trade-Off 1: Strong Consistency vs Low Latency

Strong consistency ensures that users receive accurate and up-to-date information about seat availability.

However, checking every seat reservation against the primary database can increase response time when many people are buying tickets at once.

Using cached seat information can improve response speed, but cached information may become outdated.

**My decision:** I will use caching for event information and seat availability summaries, but all seat holds and purchases must be confirmed by the primary database using transactions. This protects against double-booking while still improving browsing performance.

### Trade-Off 2: Relational Database vs NoSQL Database

A relational database provides structured tables, relationships, foreign keys, constraints, and transactions. These features are important for handling orders, payments, and seat reservations correctly.

However, relational databases can require careful scaling and database management when traffic becomes very high.

A NoSQL database can provide flexible data structures and can scale horizontally for some workloads, but managing complex relationships and transactions may be more difficult depending on the database.

**My decision:** I will use a relational database for users, events, seats, orders, and payments because ticket purchasing requires strong consistency and reliable transactions.

### Trade-Off 3: Fair Waiting Room vs Immediate Access

A waiting room protects the system from sudden traffic increases and gives users an orderly way to enter a popular sale.

However, users may have to wait before they can purchase tickets, which can make the buying experience slower.

Allowing everyone to enter immediately may feel faster, but it can overload the application and database.

**My decision:** I will use a waiting room during popular sales. It will admit users at a controlled rate and provide queue information so users understand their position and progress.

## 9. Conclusion

TicketHub requires a scalable and reliable architecture to support millions of registered users and sudden increases in traffic during popular concert sales.

The design uses a CDN, waiting room, load balancer, multiple application servers, cache, relational database, read replica, and payment service.

Transactions, row-level locking, conditional updates, and unique constraints prevent double-booking.

The design trade-offs balance performance, consistency, fairness, and reliability.

With these components working together, TicketHub can provide a secure and dependable ticket purchasing experience for customers.
