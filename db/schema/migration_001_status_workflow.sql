-- Migration 001: Status workflow expansion + status history
-- Run this against your MySQL database before deploying the corresponding API changes.

ALTER TABLE job_cards
  MODIFY COLUMN status ENUM(
    'draft',
    'under_servicing',
    'next_day_delivery',
    'upcoming_delivery',
    'ready_for_delivery',
    'payment_processing',
    'completed',
    'deleted',
    'client_agreed',
    'work_in_progress',
    'work_on_hold',
    'work_completed',
    'out_for_delivery',
    'delivered'
  ) NOT NULL DEFAULT 'draft';

ALTER TABLE job_cards
  ADD COLUMN status_history JSON NULL AFTER payment_breakdown;
