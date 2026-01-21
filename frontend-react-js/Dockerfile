FROM node:16.18

WORKDIR /frontend-react-js

# Copy only package files first
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Now copy the rest of the app
COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]