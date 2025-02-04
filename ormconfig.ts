import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'path';
import configuration from './src/common/configs/configuration';

dotenv.config();

const postgresConfig = configuration().database;

export default new DataSource({
  type: 'postgres',
  host: postgresConfig.host,
  port: postgresConfig.port,
  username: postgresConfig.user,
  password: postgresConfig.password,
  database: postgresConfig.dbName,
  entities: [],
  migrations: [
    path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
  ],
  synchronize: false,
});
