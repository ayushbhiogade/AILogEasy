from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import API routers and database function using relative imports
from .api.v1.endpoints import login, users
from .database import create_db_and_tables

# Define lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run on startup
    print("INFO:     Startup: Creating database tables...")
    create_db_and_tables()
    print("INFO:     Startup: Database tables check/creation complete.")
    yield
    # Code to run on shutdown (if any)
    print("INFO:     Shutdown complete.")

# Pass lifespan to FastAPI app
app = FastAPI(lifespan=lifespan)

# Configure CORS
origins = [
    "http://localhost:3000",  # Allow React dev server
    "http://localhost:5173",  # Allow Vite Dev server (often used by newer create-react-app or other tools)
    # Add any other origins (like your deployed frontend URL) here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- Include API Routers --- 
app.include_router(login.router, prefix="/api/v1/login", tags=["login"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

# --- Root and Health Check --- 
@app.get("/")
async def read_root():
    # Maybe redirect to docs or a status page?
    return {"message": "Welcome to LogEasy API"}

# Add a simple health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# To run this app:
# 1. cd AI-Time-Logger/backend
# 2. venv\Scripts\activate (or source venv/bin/activate)
# 3. uvicorn main:app --reload --port 8000 