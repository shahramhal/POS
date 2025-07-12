from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app =FastAPI()

#allow frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  #TODO: tighten for prod
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],    
)
@app.get("/")
def root ():
    
    return{" message": "POS System API is running!"}
