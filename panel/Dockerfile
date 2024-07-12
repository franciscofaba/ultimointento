FROM node:17.2.0

WORKDIR /react2
COPY package.json .

RUN npm install --legacy-peer-deps

COPY . ./

EXPOSE 4200

CMD ["npm","start"]