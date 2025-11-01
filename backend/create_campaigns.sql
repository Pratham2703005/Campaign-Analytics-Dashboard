PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    cost REAL NOT NULL DEFAULT 0.0,
    impressions INTEGER NOT NULL DEFAULT 0
);

DELETE FROM campaigns;

INSERT INTO campaigns (id, name, status, clicks, cost, impressions) VALUES
(1, 'Summer Sale', 'Active', 150, 45.99, 1000),
(2, 'Black Friday', 'Paused', 320, 89.50, 2500),
(3, 'Spring Launch', 'Active', 90, 20.0, 700),
(4, 'Holiday Promo', 'Active', 410, 120.75, 5400),
(5, 'Retargeting Q1', 'Paused', 60, 12.30, 400),
(6, 'New Users Campaign', 'Active', 225, 67.0, 1900),
(7, 'Brand Awareness', 'Paused', 30, 5.0, 120),
(8, 'Flash Discount', 'Active', 180, 50.5, 2100),
(9, 'Cart Abandon', 'Paused', 75, 18.2, 800),
(10, 'Referral Drive', 'Active', 140, 37.45, 1300);

COMMIT;
