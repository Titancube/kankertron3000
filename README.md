# Kankertron3000

Gratis saus

## This bot runs with

- Node.js 14 LTS (Hosted on GCP)
- Typescript
- Firebase
  - Cloud Firestore

## Installation

```node
npm install
// OR
yarn
```

## Setting up details

### Firebase

You need a serviceAccount json file to run this bot on GCP inside `./static/`
For detailed guide check the [official guide of Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)

### .env

make `.env` file on root and add it with your bot token

```env
CLIENT_TOKEN=<YOUR_BOT_TOKEN>
```
