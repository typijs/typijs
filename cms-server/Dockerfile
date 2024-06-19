# Run on Node 10x
FROM node:10-alpine

WORKDIR /app

COPY /cms-server cms-server
COPY /cms-api cms-api

# Go to cms-api folders and run command
WORKDIR /app/cms-api

RUN npm install
RUN npm link
RUN npm run build

# Go to cms-server folder and run commands
WORKDIR /app/cms-server

RUN npm install
RUN npm link @typijs/api

# Stay under cms-server folder, and run the command
CMD ["npm", "run", "dev"]
EXPOSE 3000