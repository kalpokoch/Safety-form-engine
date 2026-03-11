"""
Seed script to populate the database with sample data
Run this script to add initial branches for testing
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Branch
import uuid

def seed_branches(db: Session):
    """Add sample branches to the database"""
    
    # Check if branches already exist
    existing_count = db.query(Branch).count()
    if existing_count > 0:
        print(f"Database already has {existing_count} branches. Skipping seed.")
        return
    
    # Sample branches
    branches = [
        Branch(
            id=uuid.uuid4(),
            name="Main Office",
            location="123 Business St, Downtown, NY 10001"
        ),
        Branch(
            id=uuid.uuid4(),
            name="North Branch",
            location="456 Industrial Ave, North District, NY 10002"
        ),
        Branch(
            id=uuid.uuid4(),
            name="South Branch",
            location="789 Commerce Blvd, South District, NY 10003"
        ),
        Branch(
            id=uuid.uuid4(),
            name="East Branch",
            location="321 Enterprise Dr, East Side, NY 10004"
        ),
        Branch(
            id=uuid.uuid4(),
            name="West Branch",
            location="654 Corporate Way, West End, NY 10005"
        ),
    ]
    
    # Add branches to database
    for branch in branches:
        db.add(branch)
    
    db.commit()
    print(f"✓ Successfully added {len(branches)} branches to the database")
    
    # Display added branches
    print("\nAdded branches:")
    for branch in branches:
        print(f"  - {branch.name} ({branch.location})")

def main():
    """Main seed function"""
    print("Starting database seed...")
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables verified")
    
    # Create session and seed data
    db = SessionLocal()
    try:
        seed_branches(db)
        print("\n✓ Database seeding completed successfully!")
    except Exception as e:
        print(f"\n✗ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
