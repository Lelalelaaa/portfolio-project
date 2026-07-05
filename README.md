# Chau Senghong - Professional Portfolio

This is a full-stack MERN application built for the Web Development Final Assessment at CamTech University. It serves as my personal developer portfolio, showcasing my skills, academic background, and technical projects.

## Main Features
* **Modern Minimalist UI:** A clean, professional aesthetic designed with a focus on User Experience (UX) and F-pattern layout scanning.
* **Responsive Design:** Fully responsive layout that adapts seamlessly across Desktop, Tablet, and Mobile screens.
* **RESTful API:** A Node.js/Express backend handles project data and contact messages.
* **MongoDB Integration:** Stores all dynamic portfolio data via Mongoose schemas.
* **Admin Dashboard:** A hidden route (`/admin`) allows for full CRUD (Create, Read, Update, Delete) operations on portfolio projects without needing to touch the code.

## Technology Stack
* **Frontend:** React (Vite), React Router, Vanilla CSS, Axios, Lucide React (Icons).
* **Backend:** Node.js, Express.js, Mongoose, CORS, dotenv.
* **Database:** MongoDB Atlas (Cloud).

## Application Architecture
The project is strictly separated into client (frontend) and server (backend) directories to prepare for cloud deployment.
* `/client`: Runs on port 5173 (during development). Communicates via Axios.
* `/server`: Runs on port 5000. Serves JSON data via Express.

---

## Installation & Setup Instructions

### 1. Database Setup
This project uses MongoDB. You must provide a valid MongoDB connection string to run the backend.
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Copy your connection string.

### 2. Backend Setup
1. Open a terminal and navigate to the `server` folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file inside the `server` folder and add your connection string:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster...
   ```
4. Seed the database with initial projects: `node seed.js`
5. Start the backend server: `npm run start` (Runs on http://localhost:5000)

### 3. Frontend Setup
1. Open a new, separate terminal and navigate to the `client` folder: `cd client`
2. Install dependencies: `npm install`
3. Start the React development server: `npm run dev` (Runs on http://localhost:5173)

## Deployment
This application is designed to be deployed using cloud hosting providers:
* **Frontend:** AWS Amplify, Vercel, or Netlify
* **Backend:** AWS Elastic Beanstalk, Render, or Heroku
* **Database:** MongoDB Atlas
