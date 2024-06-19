FROM node:10-alpine

WORKDIR /cms

COPY /cms .

RUN npm install -g @angular/cli@11.2.5
RUN npm install
RUN ng build core
RUN ng build modules
RUN ng build portal

# Stay under cms-server folder, and run the command
CMD ["ng", "serve", "--host", "0.0.0.0"]
