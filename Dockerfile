# pull official base image
FROM node:18-alpine

# set working directory
WORKDIR /code
ENV PATH /code/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

#RUN yarn install --silent
RUN npm install

# add app
COPY . ./

# start app
CMD ["npm", "run", "start"]