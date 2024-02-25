# ChatSwiftly
ChatSwiftly is a real-time chatting web application designed to provide users with a seamless and intuitive chatting experience. With its modern and responsive interface, ChatSwiftly allows users to connect with each other instantly, facilitating both one-on-one and group conversations. Built with React.js, Tailwind CSS, and powered by Node.js Express for the backend, ChatSwiftly leverages Socket.IO for real-time communication and JWT for authentication. Cloudinary is used for profile picture uploads, while MongoDB serves as the database for storing user information and chat data.

# Features
User Authentication: Users can sign in securely using JWT authentication, ensuring their privacy and security.
Profile Management: Users can upload profile pictures and manage their profile information.
Real-time Chatting: Utilizing Socket.IO, ChatSwiftly enables real-time communication between users, allowing them to exchange messages instantly.
Search Functionality: Users can search for other users by email or username to start a chat with them.
Group Chatting: Users can create group chats with more than two users, facilitating collaborative discussions.
Admin Controls: Group chat admins have the authority to add or remove users from the group as needed.
Profile Viewing: Users can view their own profile as well as profiles of other users.
Notification System: ChatSwiftly includes a notification feature to keep users updated on new messages.
Chat History: Chat conversations display timestamps to provide users with context and chronology.

# Technologies Used
Frontend:

React.js: A JavaScript library for building user interfaces.
Tailwind CSS: A utility-first CSS framework for rapid UI development.
Socket.IO Client: Enables real-time, bidirectional, and event-based communication.

Backend:

Node.js with Express: A server-side JavaScript runtime and web application framework for building APIs.
Socket.IO: Enables real-time, bidirectional, and event-based communication.
JSON Web Tokens (JWT): Securely transmits information between parties as JSON objects.
MongoDB: A NoSQL database for storing user data and chat history.

# Getting Started
To run ChatSwiftly locally, follow these steps:

Clone the repository: git clone https://github.com/Ahishree29/ChatSwiftly
Navigate to the project directory: cd chatswiftly
Install dependencies for both frontend and backend: npm install
Configure environment variables, including MongoDB URI, Port number, and JWT secret.
Start the backend server: npm start
Start the frontend development server: npm start
Access ChatSwiftly in your web browser at http://localhost:3000.

# Live Demo
Check out the live version of the project https://chatapp-s1qq.onrender.com/
