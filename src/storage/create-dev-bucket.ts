import * as Minio from 'minio';
import * as config from 'config';
import * as process from 'process';

const createDevBucket = async () => {
  if (process.env.NODE_ENV === 'development') {
    throw new Error('ENV must be development');
  }

  const client = new Minio.Client({
    endPoint: config['file_storage']['minio']['end_point'],
    port: config['file_storage']['minio']['port'],
    useSSL: false,
    accessKey: config['file_storage']['minio']['root_user'],
    secretKey: config['file_storage']['minio']['root_password'],
  });

  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: ['s3:GetObject'],
        Effect: 'Allow',
        Principal: {
          AWS: ['*'],
        },
        Resource: ['arn:aws:s3:::public/*'],
        Sid: '',
      },
    ],
  };

  if (!(await client.bucketExists('public'))) {
    await client.makeBucket('public');

    await client.setBucketPolicy('public', JSON.stringify(policy));

    console.log('Bucket created');
    return;
  }

  console.log('Bucket already exists');
  return;
};

createDevBucket()
  .then(() => process.exit(1))
  .catch((error) => {
    console.log('error during creation bucket');
    console.error(error);
    process.exit(-1);
  });
