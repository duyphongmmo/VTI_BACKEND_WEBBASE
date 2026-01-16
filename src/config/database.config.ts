import * as dotenv from 'dotenv';
import * as path from 'path';
import { types } from 'pg';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const ormConfig = {
  type: 'postgres',
  host: process.env.DATABASE_POSTGRES_HOST,
  port: parseInt(process.env.DATABASE_POSTGRES_PORT),
  maxPool: parseInt(process.env.DATABASE_MAX_POOL) || 20,
  username: process.env.DATABASE_POSTGRES_USERNAME,
  password: process.env.DATABASE_POSTGRES_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: process.env.NODE_ENV === 'development',
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

const connectionOptions = new DataSource({
  type: 'postgres',
  host: ormConfig.host,
  port: ormConfig.port,
  username: ormConfig.username,
  password: ormConfig.password,
  database: ormConfig.database,
  migrations: ['dist/database/*.{ts,js}'],
  subscribers: ['dist/observers/subscribers/*.subscriber.{ts,js}'],
  synchronize: false,
  migrationsRun: false,
  logging: ormConfig.logging,
  extra: {
    max: ormConfig.maxPool,
  },
  entities: [
    'src/entities/**/*.entity.{ts,js}',
    path.join(
      __dirname,
      '/components/**/entities/*.entity.{ts,js}' /* search in components */,
    ),
  ],
  namingStrategy: new SnakeNamingStrategy(),
});

types.setTypeParser(types.builtins.INT8, (value: string): number =>
  parseFloat(value),
);

connectionOptions.initialize();
export default connectionOptions;
