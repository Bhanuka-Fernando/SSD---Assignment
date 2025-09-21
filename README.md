
# Helasuwa.lk - Hospital Management System

Helasuwa.lk is a comprehensive hospital management system built to streamline administrative, medical, and patient management processes. The system supports three key roles: Admin, Doctor, and Patient, with a pharmacy inventory management feature and integrated payment options.

## Features

### 1. Admin Portal
- **Staff Management**: Admin can add new staff members such as doctors, nurses, and support staff to the system.
- **Pharmacy Inventory**: Admin can manage the hospital's pharmacy inventory, keeping track of medicine stocks and availability.
- **Lab Test Management**: Admins can upload lab test results to the system, notifying patients via email when the results are ready.

### 2. Doctor Portal
- **Channeling Time Slots**: Doctors can set up available time slots for patient appointments.
- **Patient Management**: Doctors can view patient profiles, including past medical records and current visit reasons.
- **Examination and Prescription**: Doctors can examine patients, provide diagnoses, prescribe medicines, and recommend lab tests.
- **Prescription & Medicines**: Doctors can issue prescriptions directly through the system, sending the details to both the pharmacy and the patient's profile.
- **Lab Test Results**: Doctors can review and add lab test results.
- **Medical Records**: View and update ongoing and past medical histories of patients.

### 3. Patient Portal
- **Appointment Booking**: Patients can register and schedule appointments with available doctors based on their time slots.
- **Medical Records**: Patients can view their past medical records and prescriptions provided by doctors.
- **Lab Test Notifications**: Patients receive an email when lab results are available and can access them through their portal.
- **Payments**: Patients can pay for services through an integrated payment gateway or with insurance if available.

## Pharmacy Inventory
- **Stock Management**: The system allows for pharmacy inventory management, keeping track of medicines, stock levels, and expiration dates.

## Testing

The system includes unit tests to ensure stability and proper functionality for critical features such as:

- **Staff Management**: Verifies that Admins can successfully add staff members and send emails with login credentials.
- **Appointment Scheduling**: Ensures patients can book appointments with doctors based on available time slots.
- **Examination & Prescription**: Tests that doctors can update patient records, issue prescriptions, and manage medical histories.
- **Payment Processing**: Validates both payment gateway and insurance-based payments. 

## Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT 
-  **Testing**: Jest

