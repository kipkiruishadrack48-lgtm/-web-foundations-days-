
# Day 8 Assignment: Design an Event Ticketing System

## 1. Introduction

TicketHub is a website where users can browse concerts and events, select seats, purchase tickets, and view their tickets.

The system must support normal daily traffic and very high traffic when popular concert tickets go on sale.

## 2. Requirements

### A. Functional Requirements

The system must allow users to:

1. Register and log in.
2. Browse available concerts and events.
3. View event details, prices, dates, and venues.
4. View available and booked seats.
5. Select and temporarily hold seats.
6. Pay for reserved seats.
7. Receive booking confirmation.
8. View and access purchased tickets.

### B. Non-Functional Requirements

1. **Speed:** Event pages and seat information should load quickly, even during busy sales.
2. **Correctness:** A seat must not be sold to two different users.
3. **Fairness:** Users should receive a fair opportunity to access tickets during a popular sale.
4. **Availability:** The system should remain available during high traffic.
5. **Security:** User accounts and payment information must be protected.
6. **Scalability:** The system should handle sudden increases in visitors.

## 3. Traffic and Capacity Estimates

### A. Normal Daily Traffic

Registered users = 2,000,000.

People visiting per day = 50,000.

Each visitor views 10 pages per day.

Daily page views:

50,000 × 10 = 500,000 page views.

Average page requests per second:

500,000 ÷ 86,400 = 5.79.

Therefore, normal traffic is approximately 6 page requests per second.

Tickets sold per day = 5,000.

Average ticket sales per second:

5,000 ÷ 86,400 = 0.058 tickets per second.

### B. Popular Concert Sale Traffic

People trying to buy tickets = 200,000.

Available seats = 20,000.

Sale period = 10 minutes = 600 seconds.

Average incoming visitors per second:

200,000 ÷ 600 = 333.33 visitors per second.

Therefore, approximately 333 people arrive per second during the sale.

Average successful ticket sales per second:

20,000 ÷ 600 = 33.33 tickets per second.

The system must handle approximately 333 incoming visitors per second while selling only 20,000 available seats.

### C. Comparison

Normal traffic is approximately 6 page requests per second, while the popular concert sale brings approximately 333 visitors per second.

This means the sale creates a much higher demand than normal traffic.

To handle this, TicketHub will use a waiting room, caching, load balancing, and database transactions.

## 4. API Design

An API allows the website and server to communicate.

The following endpoints will be used:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/events | Browse available events |
| GET | /api/events/{eventId} | View event details |
| GET | /api/events/{eventId}/seats | View available seats |
| POST | /api/seats/{seatId}/hold | Temporarily reserve a seat |
| POST | /api/orders | Create an order |
| POST | /api/orders/{orderId}/pay | Process payment |
| GET | /api/users/{userId}/tickets | View purchased tickets |

The seat hold endpoint must check availability before creating a temporary reservation.

The payment endpoint must confirm that the seat hold is still valid before completing the purchase.

## 5. Database Design

TicketHub will use a relational database to store users, events, seats, and orders.

### A. Users Table

| Column | Description |
|---|---|
| user_id | Primary key |
| name | User's full name |
| email | User's email address |
| password_hash | Securely stored password |

### B. Events Table

| Column | Description |
|---|---|
| event_id | Primary key |
| event_name | Name of the concert |
| venue | Event location |
| event_date | Date of the event |

### C. Seats Table

| Column | Description |
|---|---|
| seat_id | Primary key |
| event_id | Foreign key referencing Events |
| seat_number | Seat identification |
| price | Ticket price |
| status | Available, held, or sold |

### D. Orders Table

| Column | Description |
|---|---|
| order_id | Primary key |
| user_id | Foreign key referencing Users |
| seat_id | Foreign key referencing Seats |
| order_date | Date of purchase |
| payment_status | Pending, paid, or failed |

### E. Relationships

- One user can create many orders.
- One event can have many seats.
- Each seat belongs to one event.
- Each order belongs to one user.
- Each order refers to a seat.

## 6. Preventing Double-Booking

TicketHub must prevent two users from purchasing the same seat.

I will use database transactions, row locking, and unique constraints.

The process works as follows:

1. A user selects a seat.
2. The server starts a database transaction.
3. The database locks the selected seat so another transaction cannot reserve it at the same time.
4. The system checks whether the seat is available.
5. If available, the system changes its status to held and records the hold expiry time.
6. The transaction is committed.
7. The user completes payment before the hold expires.
8. After successful payment, the seat status changes to sold.
9. If payment fails or the hold expires, the seat becomes available again.

A unique database constraint on the event and seat number prevents duplicate seat records.

A further unique constraint on the seat in the active ticket order prevents the same seat from being sold twice.

If two users attempt to hold the same seat simultaneously, the database allows only one successful transaction. The other user receives a message that the seat is no longer available.

## 7. System Architecture Diagram

```text
                 USERS
                   |
                   v
              WAITING ROOM
                   |
                   v
              LOAD BALANCER
                   |
          +--------+--------+
          |                 |
          v                 v
     APP SERVER 1       APP SERVER 2
          |                 |
          +--------+--------+
                   |
          +--------+---------+
          |        |         |
          v        v         v
        CACHE   API SERVICE  PAYMENT
          |        |         GATEWAY
          |        |
          |        v
          |    PRIMARY DATABASE
          |        |
          |        v
          |    READ REPLICA
          |
          v
       CDN
          |
          v
       USERS
```

## 8. Explanation of Architecture Components

1. **Waiting Room:** Controls the number of users entering the ticket purchasing system during a popular sale.
2. **Load Balancer:** Distributes incoming requests across application servers.
3. **Application Servers:** Process user requests, manage seat reservations, and communicate with other components.
4. **API Service:** Provides endpoints for browsing events, holding seats, placing orders, and viewing tickets.
5. **Cache:** Stores frequently requested event information to reduce database queries.
6. **Primary Database:** Stores users, events, seats, and orders and handles important booking transactions.
7. **Read Replica:** Handles read requests to reduce the workload on the primary database.
8. **Payment Gateway:** Processes payments securely and returns payment results.
9. **CDN:** Delivers images, event posters, and other static content quickly to users.

## 9. How the System Handles a Popular Concert Sale

During a popular concert sale, 200,000 people may try to purchase only 20,000 seats.

The waiting room controls the number of people entering the purchasing process at a time.

The load balancer distributes requests across multiple application servers.

The cache provides event information without sending every request to the database.

The primary database uses transactions and seat locking to prevent double-booking.

The read replica handles browsing requests while the primary database focuses on important booking operations.

The payment gateway processes payments and confirms successful purchases.

These components help TicketHub remain reliable and fair during high traffic.

## 10. Design Trade-Offs

### A. Waiting Room vs Immediate Access

A waiting room controls traffic and prevents the system from being overloaded.

However, users may have to wait before accessing the ticket purchasing page.

The system balances stability with user convenience.

### B. Strong Consistency vs Performance

Database transactions and locking prevent two users from buying the same seat.

However, locking can slow down requests when many people try to reserve seats simultaneously.

The system prioritizes correct bookings over slightly faster transactions.

### C. Read Replica vs Data Freshness

Read replicas improve performance by handling many reading requests.

However, updates may take time to appear on a replica.

The system should use the primary database for important seat availability and booking decisions.

## 11. Conclusion

TicketHub needs a scalable and reliable design to support normal traffic and popular concert sales.

Using a waiting room, load balancer, application servers, cache, relational database, read replica, and payment gateway helps the system handle high traffic.

Database transactions, row locking, and unique constraints prevent double-booking and ensure that each seat is sold only once.
