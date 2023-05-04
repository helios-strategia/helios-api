#!/bin/bash

mc config host add myminio http://localhost:9000 minio_admin minio_admin
mc mb myminio/public

server /export