FROM node:17.2.0

WORKDIR /react
COPY package.json .

RUN npm install --legacy-peer-deps


COPY . ./

EXPOSE 3000

CMD ["npm","start"]