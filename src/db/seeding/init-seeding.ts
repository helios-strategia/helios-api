import { DataSource } from 'typeorm';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { hashSync } from 'bcrypt';
import * as process from 'process';

const seed = async () => {
  const config = yaml.load(
    readFileSync(
      'C:\\Users\\Eduard\\projects\\helios-js\\config\\development.yaml',
      'utf8',
    ),
  );

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

  await dataSource.query(
    `INSERT INTO USERS(name, password, email, role) VALUES('Vasya Pupkin', '${hashSync(
      '11111111',
      12,
    )}', 'vasyapupkin@helios.com', 'ADMIN')`,
  );

  await dataSource.destroy();
};

seed()
  .then(() => {
    console.log('Data seed successful');

    process.exit(1);
  })
  .catch((error) => {
    console.log('Error during seed');
    console.log(JSON.stringify(error));
    process.exit(-1);
  });
