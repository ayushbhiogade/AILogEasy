from sqlmodel import Session, select
from typing import Optional
from sqlmodel import Session, select
from typing import Optional, List # Ensure List is imported
from . import models, security

from . import models, security

def get_user_by_email(session: Session, email: str) -> Optional[models.User]:
    statement = select(models.User).where(models.User.email == email)
    return session.exec(statement).first()

def create_user(session: Session, user_in: models.UserCreate) -> models.User:
    hashed_password = security.get_password_hash(user_in.password)
    # Create a User instance, excluding the plain password from user_in
    db_user = models.User.model_validate(user_in, update={"hashed_password": hashed_password})

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def authenticate_user(session: Session, email: str, password: str) -> Optional[models.User]:
    user = get_user_by_email(session, email=email)
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user


# --- Project CRUD ---

def create_project(*, session: Session, project_in: models.ProjectCreate, owner_id: int) -> models.Project:
    """Creates a new project owned by the given user."""
    # Create a Project instance, ensuring owner_id is set
    db_project = models.Project.model_validate(project_in, update={"owner_id": owner_id})
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project

def get_projects_by_owner(*, session: Session, owner_id: int) -> List[models.Project]:
    """Gets all projects owned by the given user."""
    statement = select(models.Project).where(models.Project.owner_id == owner_id)
    projects = session.exec(statement).all()
    return projects

def get_project_by_id(*, session: Session, project_id: int, owner_id: int) -> Optional[models.Project]:
    """Gets a specific project by its ID, ensuring it belongs to the owner."""
    statement = select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == owner_id)
    project = session.exec(statement).first()
    return project

# --- Task CRUD ---

def create_task(*, session: Session, task_in: models.TaskCreate, owner_id: int) -> models.Task:
    """Creates a new task owned by the given user."""
    # Set owner_id when creating the Task DB model instance
    db_task = models.Task.model_validate(task_in, update={"owner_id": owner_id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def get_tasks_by_owner(*, session: Session, owner_id: int, skip: int = 0, limit: int = 100) -> List[models.Task]:
    """Gets tasks owned by the given user, with pagination."""
    statement = select(models.Task).where(models.Task.owner_id == owner_id).offset(skip).limit(limit)
    tasks = session.exec(statement).all()
    return tasks

def get_task_by_id(*, session: Session, task_id: int, owner_id: int) -> Optional[models.Task]:
    """Gets a specific task by its ID, ensuring it belongs to the owner."""
    statement = select(models.Task).where(models.Task.id == task_id, models.Task.owner_id == owner_id)
    task = session.exec(statement).first()
    return task

# --- Time Entry CRUD (Basic Example) ---

def create_time_entry(*, session: Session, time_entry_in: models.TimeEntryCreate, user_id: int) -> models.TimeEntry:
    """Creates a new time entry for the given user."""
    # Set user_id when creating the TimeEntry DB model instance
    # Add logic here later to calculate duration if needed based on start/end times
    db_time_entry = models.TimeEntry.model_validate(time_entry_in, update={"user_id": user_id})
    session.add(db_time_entry)
    session.commit()
    session.refresh(db_time_entry)
    return db_time_entry

def get_time_entries_by_user(*, session: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[models.TimeEntry]:
    """Gets time entries for the given user, with pagination."""
    statement = select(models.TimeEntry).where(models.TimeEntry.user_id == user_id).order_by(models.TimeEntry.start_time.desc()).offset(skip).limit(limit)
    time_entries = session.exec(statement).all()
    return time_entries

# Add other CRUD functions later (update_task, delete_task, get_time_entries_for_task, etc.)
# Add other CRUD functions as needed (get_user, update_user, delete_user) 