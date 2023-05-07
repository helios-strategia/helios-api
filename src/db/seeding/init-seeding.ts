import { DataSource } from 'typeorm';
import { hashSync } from 'bcrypt';
import * as process from 'process';
import * as config from 'config';

const seed = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: config['database']['host'],
    port: config['database']['port'],
    database: config['database']['name'],
    username: config['database']['user'],
    password: config['database']['password'],
    logging: 'all',
    logger: 'simple-console',
  });

  await dataSource.initialize();

  await Promise.all([
    dataSource.query(
      `INSERT INTO USERS(name, password, email, role) VALUES('Vasya Pupkin', '${hashSync(
        '11111111',
        12,
      )}', 'vasyapupkin@helios.com', 'ADMIN') ON CONFLICT DO NOTHING`,
    ),
    dataSource.query(
      `INSERT INTO USERS(name, password, email, role) VALUES('Ivan Ivanov', '${hashSync(
        '22222222',
        12,
      )}', 'ivanivanov@helios.com', 'CLIENT') ON CONFLICT DO NOTHING`,
    ),
  ]);

  await dataSource.destroy();
};

seed()
  .then(() => {
    console.log('\nData seed successful');
    process.exit(1);
  })
  .catch((error) => {
    console.log('Error during seeding');
    console.log(error?.stack);
    console.log(JSON.stringify(error));
    process.exit(-1);
  });
