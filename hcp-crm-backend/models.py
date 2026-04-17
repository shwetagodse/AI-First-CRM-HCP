import os
from dotenv import load_dotenv
from sqlalchemy import Column, Integer, String, Date, Time, Text, create_engine
from sqlalchemy.engine import URL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import declarative_base, sessionmaker

# Load the hidden variables from the .env file
load_dotenv()

# Grab the password securely
db_password = os.getenv("MYSQL_PASSWORD")

database_url_object = URL.create(
    drivername="mysql+pymysql",
    username="root",
    password=db_password,  # <-- Type your exact password here
    host="127.0.0.1",
    port=3306,
    database="crm_db"
)

engine = create_engine(database_url_object)

Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
class InteractionDB(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255), index=True)
    interaction_type = Column(String(255))
    date = Column(String(255))
    time = Column(String(255))
    topics_discussed = Column(Text)
    sentiment = Column(String(255))
    follow_ups = Column(Text)

DATABASE_URL = "mysql+pymysql://root:root@127.0.0.1:3306/crm_db"
engine = create_engine(database_url_object)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)