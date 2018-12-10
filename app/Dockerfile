FROM node:8 as base
ENV PROJECT_ROOT /opt/app
WORKDIR $PROJECT_ROOT
COPY package.json package-lock.json .env $PROJECT_ROOT/
COPY src $PROJECT_ROOT/src
COPY bin $PROJECT_ROOT/bin
RUN npm install --silent

# Test container
FROM base
COPY test $PROJECT_ROOT/test
WORKDIR $PROJECT_ROOT
RUN npm run test-min

# Container for deployment
FROM base
ARG NODE_ENV=prod
ENV NODE_ENV ${NODE_ENV}
WORKDIR $PROJECT_ROOT
CMD /opt/app/bin/start-${NODE_ENV}.sh
