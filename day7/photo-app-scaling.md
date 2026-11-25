
# Day 7 Assignment: SnapShare Scaling Plan

## 1. Introduction

SnapShare is a photo-sharing application where users upload photos and view photos from people they follow.

The system must handle many users, photo uploads, and feed requests without becoming slow or unavailable.

## 2. Assumptions

I will use the following assumptions:

- SnapShare has 10 million registered users.
- 10% of registered users are active daily.
- Each active user uploads one photo per day.
- Each active user views 50 feed pages per day.
- Each original photo is 2 MB.
- Each thumbnail is 50 KB.
- A day has 86,400 seconds.
- Peak traffic is five times the average traffic.
- Photos and thumbnails are kept for one year.
- Storage calculations use decimal units and do not include backups or replication.

## 3. Daily Active Users (DAU)

Daily active users are the users who use the application each day.

Calculation:

10,000,000 × 10% = 1,000,000

Therefore, SnapShare has **1 million daily active users**.

## 4. Traffic and Storage Estimates

### A. Photo uploads per second

Each active user uploads one photo per day.

Daily uploads:

1,000,000 × 1 = 1,000,000 uploads per day.

Average uploads per second:

1,000,000 ÷ 86,400 = 11.57

Therefore, the system handles approximately **12 photo uploads per second** on average.

### B. Feed views per second

Each active user views 50 feed pages per day.

Daily feed views:

1,000,000 × 50 = 50,000,000 feed views per day.

Average feed views per second:

50,000,000 ÷ 86,400 = 578.7

Therefore, the average is approximately **579 feed views per second**.

Peak feed views per second:

579 × 5 = 2,895

Therefore, the system should be designed to handle approximately **2,895 feed views per second during peak traffic**.

### C. Photo storage per year

Each original photo is 2 MB.

Daily original photo storage:

1,000,000 × 2 MB = 2,000,000 MB = 2 TB.

Annual original photo storage:

2 TB × 365 = 730 TB.

Each thumbnail is 50 KB.

Daily thumbnail storage:

1,000,000 × 50 KB = 50 GB.

Annual thumbnail storage:

50 GB × 365 = 18.25 TB.

Total annual storage:

730 TB + 18.25 TB = 748.25 TB.

Therefore, SnapShare needs approximately **748.25 TB of storage per year** for original photos and thumbnails.

## 5. Is the System Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system**.

This is because each active user uploads one photo but views 50 feed pages per day.

The system receives many more feed requests than photo uploads.

To improve performance, I will use caching, a Content Delivery Network (CDN), and database read replicas.

## 6. Why Use Object Storage?

I will use object storage to store original photos and thumbnails instead of storing the image files directly in the database.

Object storage is suitable because:

- It can store large numbers of image files.
- It can handle large amounts of data.
- It is suitable for storing photos and other media files.
- It allows the database to focus on user information and photo details.

The database will store photo information such as the photo ID, user ID, file location, and upload date.

## 7. System Architecture Diagram

The following diagram shows how the main components work together.

```text
                    USERS
                      |
          +-----------+-----------+
          |                       |
       FEED / PHOTO             API REQUESTS
          |                       |
          v                       v
         CDN                LOAD BALANCER
          |                       |
          v                       v
   OBJECT STORAGE             APP SERVERS
   (Photos and                    |
    Thumbnails)          +--------+---------+
                         |        |         |
                         v        v         v
                       CACHE   PRIMARY   MESSAGE
                       (Redis) DATABASE   QUEUE
                                  |          |
                                  v          v
                            READ REPLICA   WORKER
                                             |
                                             v
                                      OBJECT STORAGE
                                      (Thumbnails)
```

## 8. Explanation of Each Component

### 1. Content Delivery Network (CDN)

The CDN delivers photos and thumbnails quickly to users from servers closer to their locations.

### 2. Load Balancer

The load balancer distributes incoming requests across multiple application servers to prevent one server from becoming overloaded.

### 3. Application Servers

Application servers process user requests, handle photo uploads, and communicate with the database and other services.

### 4. Cache

The cache stores frequently requested information, such as popular feeds, so that the application does not need to query the database every time.

### 5. Primary Database

The primary database stores important information such as user accounts, photo details, and relationships between users.

### 6. Database Read Replica

The read replica handles database reading requests, reducing the workload on the primary database and improving performance.

### 7. Object Storage

Object storage keeps original photos and thumbnails separately from the database.

### 8. Message Queue

The message queue stores background tasks that need to be processed, such as creating photo thumbnails.

### 9. Worker

The worker takes thumbnail tasks from the queue, creates smaller versions of photos, and saves them in object storage.

## 9. Step-by-Step Photo Upload Process

1. A user selects and uploads a photo using the SnapShare application.
2. The application sends the upload request to the load balancer.
3. The load balancer forwards the request to an available application server.
4. The application server stores the original photo in object storage.
5. The application server saves the photo information in the primary database.
6. The application server sends a thumbnail creation task to the message queue.
7. A worker receives the task from the queue.
8. The worker retrieves the original photo from object storage.
9. The worker creates a smaller thumbnail version of the photo.
10. The worker saves the thumbnail in object storage and updates its information in the database.
11. The CDN delivers the photo and thumbnail to users when requested.

## 10. Trade-Offs in the System

### 1. Caching vs Freshness

Caching improves speed because frequently requested information is stored for quick access.

However, cached information may become outdated when new photos or updates are added.

### 2. Read Replicas vs Data Consistency

Read replicas improve performance by handling more reading requests.

However, there may be a delay before new information appears on a read replica. This is called replication lag.

### 3. Background Processing vs Immediate Results

Using a message queue allows thumbnail creation to happen in the background without delaying the photo upload.

However, the thumbnail may not be available immediately after uploading the photo.

### 4. Object Storage vs Database Storage

Object storage is suitable for storing large photo files and helps reduce the workload on the database.

However, the application needs additional steps to retrieve photos from object storage.

## 11. Conclusion

SnapShare needs a scalable architecture because it has 1 million daily active users and receives many feed requests.

I recommend using a CDN, load balancer, multiple application servers, caching, a primary database with a read replica, object storage, a message queue, and background workers.

These components will help the system handle increased traffic, store photos efficiently, and provide a better experience for users.
