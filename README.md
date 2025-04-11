# Keypers

Welcome to the Keypers project! This guide will walk you through the steps to set up the development environment on your local machine, get the backend (API) and frontend (Client) running, and connect to the MongoDB Atlas database that is shared across the team.

## Prerequisites
Before starting, ensure that you have the following installed:

1. **Git** – to clone the repository.
2. **Node.js** – to run both the backend and frontend.
3. **MongoDB Atlas Account** – to connect to the shared cloud database.
4. **Yarn** – (optional but recommended) for frontend dependencies.
   - If you don't have Yarn installed, you can install it via npm:
     ```bash
     npm install --global yarn
     ```

## Step-by-Step Setup Guide

### Step 1: Clone the Repository
First, clone the project repository to your local machine:

```bash
git clone https://github.com/UXSoc/keyboard-switch-db
cd keyboard-switch-db
```

### Step 2: Set Up MongoDB Atlas Access 
 
1. **Create a MongoDB Atlas Account** : 
  - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  and sign up for an account if you don’t have one.
 
  - After logging in, create a new **cluster**  in MongoDB Atlas.
 
2. **Request Access to the Shared Database** :
  - You will need to be added to the organization that owns the MongoDB Atlas project.
 
  - Ask Lam to **add you as a collaborator**  in their MongoDB Atlas organization. 
    - To do this, Lam will go to the **"Organization"**  section in MongoDB Atlas.
 
    - They will click on the **"Invite User"**  button and input your email address associated with MongoDB Atlas to grant you access.
 
3. **Create a Database User** :
  - Once you have access to the database, go to the "Database Access" tab.
 
  - Create a new **database user**  with **read and write access**  to the database. You’ll need the username and password that the project owner created for you.

  - Make sure to store these credentials securely.
 
4. **Add Your IP Address to the Network Access List** :
  - Go to the "Network Access" tab.
 
  - Add your **current IP address**  to the whitelist so you can access the MongoDB database. 
    - To find your current public IP address, you can use [whatismyipaddress.com](https://www.whatismyipaddress.com/) .

  - After adding the IP, click "Confirm".
 
5. **Get the Connection String** :
  - Go to the "Clusters" tab.

  - Click "Connect" on your cluster.
 
  - Select "Connect your application" and copy the connection string. 
    - It will look like this:

        ```bash
        mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
        ```
 
    - Replace `<username>`, and `<password>` with the appropriate values from your MongoDB Atlas project.

### Step 3: Backend Setup (API) 
 
1. **Navigate to the `api` folder** :

```bash
cd api
```
 
2. **Install Dependencies** :
Install the required dependencies using npm:


```bash
npm install
```
 
3. **Set up Environment Variables** : 
  - Create a `.env` file inside the `api` folder.
 
  - Add the MongoDB Atlas connection string (replace `<your_connection_string>` with the one you got from MongoDB Atlas):


```bash
MONGODB_URI=mongodb+srv://<username>:<password>@switchsite.4yliz.mongodb.net/?retryWrites=true&w=majority&appName=SwitchSite
```
 
  - Make sure to replace `<username>`, `<password>`, and `<your-database-name>` with your MongoDB Atlas credentials.
 
4. **Start the Backend Server** :After setting up the `.env` file, you can start the backend server by running:

```bash
node index.js
```
The API server should now be running on `http://localhost:4000`.

### Step 4: Frontend Setup (Client) 
 
1. **Navigate to the `client` folder** :

```bash
cd client
```
 
2. **Install Dependencies** :
Install the required dependencies using Yarn:


```bash
yarn install
```
 
3. **Start the Client Server** :
After the dependencies are installed, you can start the client (frontend) server:


```bash
yarn start
```
The client server should now be running on `http://localhost:3000`.






## Repository Structure 


```bash
keyboard-switch-db
│
├── client/           # Frontend React app
│   └── src/          # React source code
│
├── api/              # Backend Node.js API
│   └── models/       # MongoDB models
│   └── routes/       # API routes
│   └── index.js      # Main server file
│
└── README.md         # This guide
```


---

