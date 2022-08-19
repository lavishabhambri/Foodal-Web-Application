FROM node:17.3.1

WORKDIR '/app'

COPY package.json package-lock.json ./

RUN npm i

COPY . .

CMD ["npm", "run", "dev"]