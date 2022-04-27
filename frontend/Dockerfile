FROM node:17.5.0

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "start"]