<img width="1500" height="955" alt="Screenshot 2025-09-15 194156" src="https://github.com/user-attachments/assets/9db954cb-f2cf-48d9-b236-1350a0d2a041" />
<img width="1500" height="927" alt="Screenshot 2025-09-15 194205" src="https://github.com/user-attachments/assets/ebd19dc2-d9ef-4352-adf1-9798064a712f" />
<img width="1500" height="930" alt="Screenshot 2025-09-15 194244" src="https://github.com/user-attachments/assets/e1256790-9387-4b68-8dea-76811253eb13" />
<img width="1500" height="928" alt="Screenshot 2025-09-15 194252" src="https://github.com/user-attachments/assets/5f26d0d4-b393-4d03-96b1-1566fd8be723" />
<img width="1500" height="923" alt="Screenshot 2025-09-15 194938" src="https://github.com/user-attachments/assets/509911bb-3b68-4f3e-b14b-a34281b8862b" />
# AI – Career Counseling Chat App

This is an AI-powered career counseling platform featuring secure authentication and a modern chat interface.  
This project uses Next.js, NextAuth, Prisma, PostgreSQL, and tRPC.

---

## 🚀 Features

- Email/password authentication (NextAuth + Prisma)
- Secure user/session management
- AI-powered chat with editable session titles(Gemini)
- Modern, responsive UI with light/dark mode toggle
- Persistent chat history per user

---

## 🛠️ Setup Instructions

### 1. **Clone the Repository**

### 2. **Install Dependencies**


### 3. **Configure Environment Variables**

Create a `.env` file in the root directory and add:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
```

> Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your PostgreSQL credentials.

### 4. **Set Up the Database**

- Edit `prisma/schema.prisma` if needed.
- Run Prisma migrations:

```
npx prisma migrate dev --name init
```

- Generate Prisma client:

```
npx prisma generate
```

### 5. **Start the Development Server**

```
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧑‍💻 Authentication

- Sign up and log in with email and password.
- Sessions are managed via NextAuth and stored in PostgreSQL.

---

## 💬 Chat Features

- Start new chat sessions.
- Edit chat session titles.
- Send and receive AI-powered messages.
- All chats are private and tied to your account.

---

## 🎨 UI/UX

- Responsive layout for desktop and mobile.
- Sidebar for chat sessions.
- Sticky input and header.
- Toggle between light and dark mode.

---

## 🗄️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API routes, tRPC
- **Auth:** NextAuth.js (CredentialsProvider)
- **Database:** PostgreSQL (via Prisma ORM)

---

## 📝 Prisma Schema

See [`prisma/schema.prisma`](prisma/schema.prisma) for all models:
- `User`, `Session`, `Verification`, `ChatSession`, `Message`, `Role`

---

## 🧪 Testing

You can use [Prisma Studio](https://pris.ly/d/studio) to inspect your database:

```sh
npx prisma studio
```

---

## 📦 Deployment

- Set your environment variables in your deployment platform.
- Run migrations and generate Prisma client.
- Deploy as a Next.js app (Vercel, Netlify, etc).

---

## 🤝 Contributing

Pull requests and issues are welcome!

---

