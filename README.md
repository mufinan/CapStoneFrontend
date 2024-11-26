# Library Management System - Frontend

This is the **frontend** for the Library Management System, a React-based web application. It provides a user-friendly interface to manage books, authors, categories, publishers, and borrowing operations.

## 🔑 Important Information

1. **Backend Service**:
   - **Ensure that the backend service is running and accessible at the correct URL**. 
   - If backend service is not accesible, please go to https://capstone-mtlt.onrender.com to break inactivity on the service.

2. **Known Limitations**:
   - The application does not support responsive design; it is optimized for 1200px width.
   - Borrow operations require at least one valid book to be selected from the database.

3. **Notifications**:
   - Success and error messages are displayed as notifications (no `window.alert` is used).
   - If you encounter persistent issues, check the console for error logs.


## 🌐 Live Demo

The application is live and can be accessed at: [Library Management System](https://mufinan-library-management-system.netlify.app)

## 🚀 Features

### Core Features:
1. **Home Page**:
   - Quick navigation to other sections.
2. **Publishers**:
   - Add, update, delete publishers.
3. **Categories**:
   - Add, update, delete categories.
4. **Books**:
   - Add, update, delete books and associate them with authors, publishers, and categories.
5. **Authors**:
   - Add, update, delete authors.
6. **Borrow Operations**:
   - Borrow and return books with borrower details.

### Additional Features:
- Dynamic error and success notifications.
- Material-UI for styling and layout.


## 🛠️ Technologies Used

- **Frontend**:
  - React
  - React Router
  - Material-UI (MUI) for design and layout
  - Axios for API requests


## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- A running backend service for API integration.

### Steps to Run Locally
1. Clone the repository:
   ```git clone git https://github.com/mufinan/CapStoneFrontend.git```
2. Install dependencies:
   ```npm install```
3. Start the development server:
   ```npm start```
4. Open http://localhost:3000 in your browser to view the app.


## 🌟 Future Enhancements

- Add user authentication and role-based access control.
- Implement pagination for large datasets.
- Add export functionality for reports (PDF/Excel).


## ✨ Author

This project is maintained by **Mustafa Furkan İnan**.
