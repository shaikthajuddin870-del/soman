Dholakpur Python Hero Lab v15 — All Features Stable

Student registration:
- The entered email receives a 6-digit OTP.
- The student account is inserted into users.db only after OTP verification.
- Unverified pending registrations cannot log in.

Why OTP may not arrive:
- A real sender mailbox must be configured for SMTP. The ZIP does not contain your personal mailbox credentials.
- For Gmail, use a Google App Password with 2-Step Verification; do not use the normal Gmail password.

Easy setup:
1. Extract the ZIP.
2. Run run.bat.
3. Login as Admin.
4. Open "OTP Email Setup".
5. Enter your Gmail address and Gmail App Password, click "Save Email Settings".
6. Enter a test recipient email and click "Send Test OTP".
7. Once the test email arrives, student registration OTP delivery is ready.

Optional Windows helper:
- Run setup_email.bat to create .env directly.

The admin email setup stores the SMTP password in the local .env file. Keep this project folder private and do not upload the .env file.


Included together in this build:
- Original v14 student website layout (no extra Variables featured section).
- Variables comic mapping kept with the normal lesson/comic library.
- Browser compiler input() handled with a browser prompt to avoid Pyodide stdin I/O errors.
- Email OTP verification: an account is created only after the emailed 6-digit code is verified.
- Admin Student Progress button and module-wise progress graph for 40 lessons (10 per module).
- Student completion is saved in SQLite when Mark as Complete is clicked.


## Email OTP setup

The first run of `run.bat` opens a Gmail OTP setup wizard when SMTP is not configured. Enter your sender Gmail address and a Google App Password. The wizard tests the SMTP login before starting the site. Never put your normal Gmail password into the app.
