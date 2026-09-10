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
       create table workflows(
            workflow_id UUID default gen_random_uuid() primary key,
            tenant_id uuid NOT NULL,
            type VARCHAR(100) not null,
            status VARCHAR(20) not null default 'running' check(status in ('running' , 'completed' , 'failed' ,'cancelled')),
            current_state JSONB,
            created_at timestamp with time zone default CURRENT_TIMESTAMP,
            updated_at timestamp with time zone default CURRENT_TIMESTAMP
        ) 
    `);

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP table workflows;    
    `);

};
