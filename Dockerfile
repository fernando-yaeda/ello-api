# build step

FROM node:16 as build
WORKDIR /usr/src/ello
COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY ./prisma ./prisma
RUN npm install
COPY . .
RUN npm run build

# run step

FROM node:16
WORKDIR /usr/src/ello
COPY ./package*.json ./
COPY ./prisma ./prisma
RUN npm install --only=production --ignore-scripts
RUN npm i -g bcrypt
RUN npm link bcrypt
COPY --from=build /usr/src/ello/dist ./dist