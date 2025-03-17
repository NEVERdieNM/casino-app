# Database Seeding

This directory contains scripts to seed the database with sample data for development and testing purposes.

## Usage

To seed the database, run:

```
npm run seed
```

## What gets seeded

- Admin user (username: admin, password: admin123)
- Regular users (usernames: alice, bob, charlie, david, emma, password: password123)
- Sample games (slots, blackjack, roulette, poker, baccarat)
- Sample transactions (deposits, bets, wins, withdrawals)

## Note

The seeding process will DELETE all existing data in the collections it seeds. Use with caution in non-development environments.