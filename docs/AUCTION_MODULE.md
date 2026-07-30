# BidArena - Auction Module Documentation

This document outlines the REST APIs and Socket.IO real-time events that power the BidArena Auction Module.

## 🔗 REST API Endpoints
Base URL: `/api/v1/auctions`

### 1. Create a New Auction
- **Method:** `POST`
- **Path:** `/api/v1/auctions`
- **Access:** Protected (Requires Authentication)
- **Body:**
  ```json
  {
    "title": "Vintage Leather Jacket",
    "description": "A genuine vintage leather jacket from the 1980s.",
    "startBid": 150,
    "duration": 65,
    "startTime": "2026-07-30T10:00:00.000Z",
    "image": "https://example.com/image.jpg"
  }
  ```
- **Note:** `duration` is expected in **seconds** (minimum 60s). Auctions with a `startTime` in the past or present will be automatically created with an `"active"` status.

### 2. Get All Auctions
- **Method:** `GET`
- **Path:** `/api/v1/auctions`
- **Access:** Public
- **Query Params (Optional):** `?status=active` (or `upcoming`, `completed`)
- **Returns:** An array of auctions populated with the seller's name and email.

### 3. Get Auction by ID
- **Method:** `GET`
- **Path:** `/api/v1/auctions/:id`
- **Access:** Public
- **Returns:** Single auction object populated with seller and highest bidder details.

### 4. Update Auction
- **Method:** `PATCH`
- **Path:** `/api/v1/auctions/:id`
- **Access:** Protected (Only the seller can update)
- **Body:** Any of the fields used in creation (e.g. `startTime`, `title`).

### 5. Delete Auction
- **Method:** `DELETE`
- **Path:** `/api/v1/auctions/:id`
- **Access:** Protected (Only the seller can delete)

### 6. Get Auction Timeline
- **Method:** `GET`
- **Path:** `/api/v1/auctions/:id/timeline`
- **Access:** Public
- **Returns:** An array of timeline events (created, started, bid_placed, completed) sorted chronologically (newest first).

---

## ⚡ Real-Time Socket.IO Events

The Socket.IO server is used to manage real-time bids, countdown timers, and live chat within an auction room.
**Connection URL:** `http://localhost:5000` (or whatever your server port is)

### 📡 Events to Fire (Client ➡️ Server)

#### `join-room`
- **Description:** Join a specific auction room to start receiving updates.
- **Payload:** `auctionId` (string)
  ```text
  "6a6adf1f240b662d51f8affe"
  ```

#### `place-bid`
- **Description:** Submit a bid. Requires an acknowledgment callback.
- **Payload:**
  ```json
  {
    "auctionId": "6a6adf1f240b662d51f8affe",
    "amount": 250
  }
  ```
- **Note:** The bidder's identity (`userId`) is securely derived from the authenticated socket session, so you don't need to pass it in the payload.

#### `send-message`
- **Description:** Send a chat message to the room.
- **Payload:**
  ```json
  {
    "auctionId": "6a6adf1f240b662d51f8affe",
    "message": "Is this item authentic?",
    "user": { "name": "Shashank" }
  }
  ```

#### `leave-room`
- **Description:** Leave the room and stop receiving updates.
- **Payload:** `auctionId` (string)

---

### 🎧 Events to Listen For (Server ➡️ Client)

#### `timer-sync`
- **Description:** Broadcasts every second with the remaining time.
- **Payload:**
  ```json
  { "timeLeft": 65 }
  ```

#### `bid-update`
- **Description:** Broadcasts instantly when a valid bid is placed, and emitted to a client immediately upon joining.
- **Payload:**
  ```json
  {
    "currentHighestBid": 250,
    "highestBidder": "userId_here",
    "timestamp": "2026-07-30T10:00:00.000Z"
  }
  ```

#### `active-bidders-count`
- **Description:** Emitted to a client when they join an active auction room, indicating the number of unique users who have placed bids.
- **Payload:**
  ```json
  {
    "count": 5
  }
  ```

#### `receive-message`
- **Description:** Broadcasts when a user sends a chat message.
- **Payload:**
  ```json
  {
    "user": { "name": "Shashank" },
    "message": "Is this item authentic?",
    "timestamp": "2026-07-30T10:00:00.000Z"
  }
  ```

#### `auction-completed`
- **Description:** Broadcasts the moment the timer hits 0.
- **Payload:**
  ```json
  {
    "winner": "userId_here",
    "finalBid": 250
  }
  ```
