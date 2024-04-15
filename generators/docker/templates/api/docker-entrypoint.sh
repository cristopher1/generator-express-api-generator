#!/usr/bin/env bash

# Run migrations when NODE_ENV is development
if [[ ${NODE_ENV} = "development" ]]
then
  ./wait-for-it.sh ${DB_HOST}:${DB_PORT} --timeout=45 -- npx sequelize-cli db:migrate
fi

exec "$@"
