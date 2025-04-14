FROM node:20

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY index.ts index.ts
COPY tsconfig.json tsconfig.json




RUN npm install
RUN npm install -g ts-node nodemon

ENTRYPOINT ["ts-node","index.ts"]