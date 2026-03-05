# Trendora 🛍️

A modern fashion e-commerce web application built with React and a Python/FastAPI backend.

## 🚀 Live Demo

Frontend: [https://trendora-studio.web.app](https://trendora-studio.web.app)

## 🛠️ Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Radix UI components (shadcn/ui)
- React Router v7
- Axios
- CRACO

### Backend
- Python / FastAPI
- MongoDB (via seed data)

## 📦 Features

- 🔐 User Authentication (JWT)
- 🛒 Shopping Cart
- 🎨 Dark/Light Theme Toggle
- 🔊 Audio Manager
- 🏷️ Collections & Featured Products
- 🚀 Checkout with Razorpay integration
- 🔍 Gender Filter

## 💻 Local Development

### Frontend
```bash
cd frontend
yarn install
yarn start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python server.py
```

Set `REACT_APP_BACKEND_URL` in your environment to point to the backend server.

## 📁 Project Structure

```
Trendora/
├── frontend/          # React app
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── services/
│       └── data/
├── backend/           # Python server
│   ├── server.py
│   ├── seed_data.py
│   └── requirements.txt
└── tests/             # Test suite
```

## 📄 License

MIT
