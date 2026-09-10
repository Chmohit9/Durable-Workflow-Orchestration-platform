/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`
        create table workflow_events(
            event_id UUID default gen_random_uuid() primary key,
            workflow_id uuid not null references workflows(workflow_id),
            sequence_number BIGSERIAL,
            event_type VARCHAR(30) not null check(event_type in ('workflow_started', 'activity_scheduled', 'activity_completed', 'timer_fired','signal_received')),
            payload JSONB,
            time_stamp timestamp with time zone default CURRENT_TIMESTAMP
        );
    `);
    pgm.sql(`
        create INDEX idx_workflow_events_workflow_sequence ON workflow_events (workflow_id,sequence_number);
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
       DROP TABLE workflow_events; 
    `);
};
