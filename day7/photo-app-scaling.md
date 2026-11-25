
# Day 7 Assignment: Scaling a Photo-Sharing App

## 1. Introduction

SnapShare is a photo-sharing application where users upload photos and view photos from people they follow.

The system needs a scalable architecture to handle many users, photo uploads, and feed requests without becoming slow or unavailable.

## 2. Assumptions

I will use the following assumptions:

- SnapShare has 10 million registered users.
- 10% of registered users are active daily.
- Each active user uploads one photo per day.
- Each active user views 50 feed pages per day.
- Each original photo is 2 MB.
- Each thumbnail is 50 KB.
- One day has 86,400 seconds.
- Peak traffic is five times the average traffic.
- Photos are stored for one year.
- Storage calculations use decimal units and exclude backups and replication.

## 3. Daily Active Users (DAU)

Daily active users are the number of users who use the application each day.

Calculation:

10,000,000 × 10% = 1,000,000

Therefore, SnapShare has 1 million daily active users.

## 4. Traffic and Storage Estimates

### A. Photo uploads per second

Each active user uploads one photo per day.

Daily uploads:

1,000,000 × 1 = 1,000,000 uploads.

Average uploads per second:

1,000,000 ÷ 86,400 = 11.57

Therefore, the system handles approximately 12 photo uploads per second on average.

Peak uploads per second:

11.57 × 5 = 57.85

Therefore, the system should support approximately 58 uploads per second during peak traffic.

### B. Feed views per second

Each active user views 50 feed pages per day.

Daily feed views:

1,000,000 × 50 = 50,000,000 feed views.

Average feed views per second:

50,000,000 ÷ 86,400 = 578.7

Therefore, the system handles approximately 579 feed views per second on average.

Peak feed views per second:

579 × 5 = 2,895

Therefore, the system should handle approximately 2,895 feed views per second during peak traffic.

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

Therefore, SnapShare requires approximately 748.25 TB of storage per year for original photos and thumbnails.

## 5. Is the System Read-Heavy or Write-Heavy?

SnapShare is a read-heavy system.

This is because each active user uploads one photo but views 50 feed pages per day.

The system receives many more feed requests than photo uploads.

To improve performance, I will use caching, a Content Delivery Network (CDN), and database read replicas.

## 6. Why Use Object Storage?

I will use object storage to store original photos and thumbnails instead of storing image files directly in the database.

Object storage is suitable because:

- It can store large numbers of image files.
- It can handle large amounts of data.
- It is designed for storing photos and other media files.
- It reduces the workload on the database.

The database will store photo information such as photo ID, user ID, file location, and upload date.

## 7. System Architecture Diagram

```text
                         USERS
                           |
                    +------+------+
                    |             |
                 FEED          API REQUESTS
                    |             |
                    v             v
                   CDN       LOAD BALANCER
                    |             |
                    |        +----+----+
                    |        |         |
                    |        v         v
                    |     APP SERVER  APP SERVER
                    |        |         |
                    |        +----+----+
                    |             |
                    |       +-----+------+
                    |       |            |
                    |       v            v
                    |     CACHE      PRIMARY DATABASE
                    |                    |
                    |                    v
                    |                READ REPLICA
                    |
                    v
              OBJECT STORAGE
              (Original Photos
               and Thumbnails)

              APP SERVER
                   |
                   v
              MESSAGE QUEUE
                   |
                   v
                 WORKER
                   |
                   v
             OBJECT STORAGE
               (Thumbnails)
```

## 8. Explanation of Each Component

1. **Content Delivery Network (CDN):** The CDN delivers photos and thumbnails quickly to users from servers closer to their locations.

2. **Load Balancer:** The load balancer distributes incoming requests across multiple application servers to prevent one server from becoming overloaded.

3. **Application Servers:** Application servers process user requests, handle photo uploads, and communicate with the database and other services.

4. **Cache:** The cache stores frequently requested information, such as popular feeds, so the application does not need to query the database every time.

5. **Primary Database:** The primary database stores important information such as user accounts, photo details, and relationships between users.

6. **Database Read Replica:** The read replica handles database reading requests, reducing the workload on the primary database and improving performance.

7. **Object Storage:** Object storage keeps original photos and thumbnails separately from the database.

8. **Message Queue:** The message queue stores background tasks, such as thumbnail creation, until a worker is ready to process them.

9. **Worker:** The worker processes thumbnail creation tasks, generates smaller versions of photos, and saves them in object storage.

## 9. Step-by-Step Photo Upload Process

1. A user selects a photo and uploads it using the SnapShare application.
2. The application sends the upload request to the load balancer.
3. The load balancer forwards the request to an available application server.
4. The application server validates the photo and checks that the upload is allowed.
5. The application server stores the original photo in object storage.
6. The application server saves the photo information, such as photo ID, user ID, and file location, in the primary database.
7. The application server sends a thumbnail creation task to the message queue.
8. The message queue holds the task until a worker is available.
9. The worker receives the thumbnail creation task from the queue.
10. The worker retrieves the original photo from object storage.
11. The worker creates a smaller thumbnail version of the original photo.
12. The worker saves the thumbnail in object storage.
13. The worker updates the database with the thumbnail file location.
14. The application server returns a successful upload response to the user after the original photo and its information have been saved.
15. The CDN delivers the original photo and thumbnail to users when requested.

This process allows thumbnail creation to happen in the background without delaying the original photo upload.

## 10. Design Trade-Offs

A design trade-off occurs when improving one part of a system may create a disadvantage in another part.

### 1. Read Replica Latency vs Data Consistency

Read replicas improve performance by handling many reading requests and reducing the workload on the primary database.

However, replication may take time. This means users may temporarily see outdated information when reading from a replica.

The system must balance faster reading with accurate and up-to-date information.

### 2. CDN Cache Cost vs Performance

A CDN improves performance by storing frequently requested photos closer to users.

However, using a large CDN cache increases costs. A smaller cache may reduce costs but can lead to more requests going directly to object storage.

The system must balance CDN costs with faster photo delivery.

### 3. Background Processing vs Immediate Results

A message queue allows thumbnail creation to happen in the background, making photo uploads faster and reducing the work performed during the main upload request.

However, thumbnails may not be immediately available because the worker processes tasks asynchronously.

The system must balance faster uploads with the delay in thumbnail availability.

## 11. Conclusion

SnapShare is a read-heavy application that requires a scalable architecture to handle large numbers of feed requests and photo uploads.

Using a CDN, load balancer, application servers, cache, database read replica, object storage, message queue, and worker helps improve performance, reliability, and scalability.
