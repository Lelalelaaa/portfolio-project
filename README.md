# Chau Senghong - Professional Portfolio

This is a full-stack MERN application built for the Web Development Final Assessment.

## Main Features
* **Modern UI:** Premium dark-mode aesthetic with glassmorphism and looping marquee animations.
* **Responsive Design:** Works seamlessly on Desktop, Tablet, and Mobile.
* **RESTful API:** Node.js/Express backend handles project data and contact messages.
* **MongoDB Integration:** Stores all dynamic data via Mongoose schemas.
* **Admin Dashboard:** A hidden route (`/admin`) allows for CRUD operations on projects and viewing messages.

## Technology Stack
* **Frontend:** React (Vite), React Router, Vanilla CSS, Axios, Lucide React (Icons).
* **Backend:** Node.js, Express.js, Mongoose, CORS, dotenv.
* **Database:** MongoDB Atlas (Cloud).

## Application Architecture
The project is strictly separated into client (frontend) and server (backend) directories to prepare for cloud deployment.
* `/client`: Runs on port 5173. Communicates via Axios.
* `/server`: Runs on port 5000. Serves JSON data via Express.

---

## Installation Instructions

### 1. MongoDB Setup (Required)
Since you don't have MongoDB installed on your computer, you will use **MongoDB Atlas** (a free cloud database):
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign up for a free account.
2. Create a free shared cluster.
3. In "Database Access", create a new user and password.
4. In "Network Access", add `0.0.0.0/0` to allow connections from anywhere.
5. Click "Connect" -> "Connect your application" and copy the connection string.

### 2. Environment Variables
1. Navigate to the `server` folder.
2. Rename `.env.example` to `.env`.
3. Paste your MongoDB connection string into `MONGO_URI`, replacing `<username>` and `<password>`.
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://yourUser:yourPass@cluster0...
   ```

### 3. Running the Backend
```bash
cd server
npm install
npm run start
```
The server will run on `http://localhost:5000`.

### 4. Running the Frontend
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The React app will open at `http://localhost:5173`.

---

## API Endpoint Summary
| HTTP Method | Endpoint | Purpose |
|-------------|----------|---------|
| GET | `/api/projects` | Retrieve all projects |
| GET | `/api/projects/:id`| Retrieve one project by ID |
| POST | `/api/projects` | Add a new project |
| PUT | `/api/projects/:id`| Update an existing project |
| DELETE | `/api/projects/:id`| Delete a project |
| POST | `/api/messages` | Submit a contact form message |
| GET | `/api/messages` | Retrieve all submitted messages |

## Deployment Instructions (AWS)
1. **Frontend**: Build using `npm run build`. Upload the `dist` folder to an AWS S3 bucket configured for static website hosting, or connect the GitHub repo to AWS Amplify.
2. **Backend**: Deploy the Node app using AWS Elastic Beanstalk or EC2. Ensure environment variables (`MONGO_URI`) are set in the AWS console.

## Author Information
* **Name:** Chau Senghong
* **Email:** senghongchau@gmail.com
* **University:** CamTech University
* **Major:** Software Engineering
