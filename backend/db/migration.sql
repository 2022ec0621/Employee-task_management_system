CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  role VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

--  create ENUM only if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'task_status'
    ) THEN
        CREATE TYPE task_status AS ENUM ('todo','in_progress','done');
    END IF;
END$$;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- migration_auth.sql
CREATE TABLE IF NOT EXISTS users (
  id UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

--sample employee data
INSERT INTO tasks (title, description, status, assigned_to, due_date) VALUES
('Design Landing Page', 'Create design mockups for homepage', 'todo',
    (SELECT id FROM employees WHERE email='alice.johnson@example.com'), '2025-12-01'),

('Fix Authentication Bug', 'Solve token refresh issue', 'in_progress',
    (SELECT id FROM employees WHERE email='daniel.vincent@example.com'), '2025-12-05'),

('Write API Tests', 'Add Jest tests for employee routes', 'todo',
    (SELECT id FROM employees WHERE email='bob.smith@example.com'), '2025-12-09'),

('Build Admin Dashboard', 'Create analytics dashboard for admin', 'in_progress',
    (SELECT id FROM employees WHERE email='karen.miller@example.com'), '2025-12-15'),

('Optimize SQL Queries', 'Improve database performance', 'todo',
    (SELECT id FROM employees WHERE email='frank.moore@example.com'), '2025-12-03'),

('Create Dark Mode', 'Implement UI dark mode switching', 'in_progress',
    (SELECT id FROM employees WHERE email='thomas.young@example.com'), '2025-12-12'),

('Sprint Report Preparation', 'Prepare sprint demo notes', 'done',
    (SELECT id FROM employees WHERE email='mia.thompson@example.com'), '2025-11-22'),

('Fix Mobile Responsiveness', 'Improve mobile UI for all pages', 'todo',
    (SELECT id FROM employees WHERE email='emily.carter@example.com'), '2025-12-20'),

('Setup CI/CD Pipeline', 'Github Actions workflow for deployment', 'in_progress',
    (SELECT id FROM employees WHERE email='frank.moore@example.com'), '2025-12-18'),

('Add Search Feature', 'Implement search for employees', 'todo',
    (SELECT id FROM employees WHERE email='ryan.scott@example.com'), '2025-12-17'),

('Refactor Task Module', 'Clean up task controller and routes', 'done',
    (SELECT id FROM employees WHERE email='liam.davis@example.com'), '2025-11-30'),

('Create Email Templates', 'Design templates for notifications', 'todo',
    (SELECT id FROM employees WHERE email='queen.roberts@example.com'), '2025-12-25'),

('Improve Form Validation', 'Add frontend + backend validations', 'in_progress',
    (SELECT id FROM employees WHERE email='harry.wilson@example.com'), '2025-12-07'),

('Implement Role-Based Access', 'Add admin/user roles', 'todo',
    (SELECT id FROM employees WHERE email='catherine.lopez@example.com'), '2025-12-29'),

('UI Bug Fix - Buttons', 'Fix misaligned buttons on tasks page', 'done',
    (SELECT id FROM employees WHERE email='emily.carter@example.com'), '2025-11-28'),

('Server Deployment', 'Deploy new backend build', 'done',
    (SELECT id FROM employees WHERE email='frank.moore@example.com'), '2025-11-21'),

('Add Sorting Feature', 'Sort tasks by date & status', 'todo',
    (SELECT id FROM employees WHERE email='thomas.young@example.com'), '2025-12-16'),

('Image Optimization', 'Compress assets for fast loading', 'in_progress',
    (SELECT id FROM employees WHERE email='alice.johnson@example.com'), '2025-12-14'),

('Customer Feedback Summary', 'Summarize feedback from system users', 'done',
    (SELECT id FROM employees WHERE email='queen.roberts@example.com'), '2025-11-25'),

('Update Readme', 'Improve project documentation', 'todo',
    (SELECT id FROM employees WHERE email='liam.davis@example.com'), '2025-12-10');

INSERT INTO employees (name, email, role) VALUES
('Arun Kumar', 'arun.kumar@example.com', 'Developer'),
('Priya Sharma', 'priya.sharma@example.com', 'UI/UX Designer'),
('Rohit Verma', 'rohit.verma@example.com', 'Backend Developer'),
('Sneha Reddy', 'sneha.reddy@example.com', 'QA Engineer'),
('Vikram Singh', 'vikram.singh@example.com', 'Project Manager'),
('Kavya Menon', 'kavya.menon@example.com', 'HR Manager'),
('Sahil Patel', 'sahil.patel@example.com', 'DevOps Engineer'),
('Meera Das', 'meera.das@example.com', 'Business Analyst'),
('Anuj Mishra', 'anuj.mishra@example.com', 'Support Engineer'),
('Nisha Iyer', 'nisha.iyer@example.com', 'Product Owner');


-- 20 sample tasks assigned to the 10 employees (uses employee email to find UUID)
INSERT INTO tasks (title, description, status, assigned_to, due_date) VALUES
('Implement OAuth2 Login', 'Add OAuth2 login with Google', 'in_progress',
  (SELECT id FROM employees WHERE email='arun.kumar@example.com'), '2025-12-05'),
('Design Landing Page', 'Create hero section and CTA', 'todo',
  (SELECT id FROM employees WHERE email='priya.sharma@example.com'), '2025-12-01'),
('API Pagination', 'Add cursor pagination to employees API', 'todo',
  (SELECT id FROM employees WHERE email='rohit.verma@example.com'), '2025-12-10'),
('Regression Test Suite', 'Write regression tests for tasks module', 'in_progress',
  (SELECT id FROM employees WHERE email='sneha.reddy@example.com'), '2025-11-30'),
('Sprint Planning', 'Plan next sprint stories and tasks', 'done',
  (SELECT id FROM employees WHERE email='vikram.singh@example.com'), '2025-11-18'),
('Recruitment Interview', 'Coordinate interviews with candidates', 'todo',
  (SELECT id FROM employees WHERE email='kavya.menon@example.com'), '2025-12-12'),
('Kubernetes Setup', 'Create k8s manifests for staging', 'in_progress',
  (SELECT id FROM employees WHERE email='sahil.patel@example.com'), '2025-12-07'),
('Business Requirements', 'Gather requirements for new feature', 'todo',
  (SELECT id FROM employees WHERE email='meera.das@example.com'), '2025-12-14'),
('Customer Support Triage', 'Resolve urgent support tickets', 'in_progress',
  (SELECT id FROM employees WHERE email='anuj.mishra@example.com'), '2025-11-28'),
('Roadmap Review', 'Review product roadmap with stakeholders', 'done',
  (SELECT id FROM employees WHERE email='nisha.iyer@example.com'), '2025-11-20'),

('Accessibility Audit', 'Run accessibility checks and fix issues', 'todo',
  (SELECT id FROM employees WHERE email='priya.sharma@example.com'), '2025-12-08'),
('Database Migration', 'Migrate DB schema to new version', 'in_progress',
  (SELECT id FROM employees WHERE email='rohit.verma@example.com'), '2025-12-03'),
('End-to-end Tests', 'Write Playwright tests for major flows', 'todo',
  (SELECT id FROM employees WHERE email='sneha.reddy@example.com'), '2025-12-20'),
('Feature Flagging', 'Add feature flags for new UI', 'in_progress',
  (SELECT id FROM employees WHERE email='arun.kumar@example.com'), '2025-12-09'),
('Update Onboarding Docs', 'Improve docs for new hires', 'done',
  (SELECT id FROM employees WHERE email='kavya.menon@example.com'), '2025-11-25'),
('CI Pipeline Fix', 'Fix flaky CI failing on lint step', 'in_progress',
  (SELECT id FROM employees WHERE email='sahil.patel@example.com'), '2025-12-02'),
('User Research', 'Conduct interviews with 10 users', 'todo',
  (SELECT id FROM employees WHERE email='meera.das@example.com'), '2025-12-22'),
('Support Automation', 'Automate common support replies', 'todo',
  (SELECT id FROM employees WHERE email='anuj.mishra@example.com'), '2025-12-11'),
('Product Demo', 'Prepare demo for potential clients', 'done',
  (SELECT id FROM employees WHERE email='nisha.iyer@example.com'), '2025-11-26'),
('Performance Tuning', 'Profile and optimize slow endpoints', 'todo',
  (SELECT id FROM employees WHERE email='vikram.singh@example.com'), '2025-12-18');
