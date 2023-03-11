# Specify Node Version and Image
# Name Image development (can be anything)
FROM node:14 AS development

# Specify Working directory inside container
WORKDIR /ner/src/app

# Copy package-lock.json & package.json from host to inside container working directory
RUN npm install

COPY . .
RUN npm run build

FROM node



EXPOSE 3000




################
## PRODUCTION ##
################
# Build another image named production
FROM node:14 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /ner/src/app

COPY --from=development /ner/src/app/ .

EXPOSE 3000

# run app
CMD [ "node", "dist/main"]