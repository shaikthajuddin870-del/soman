from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from email.message import EmailMessage
import sqlite3, os, re, secrets, smtplib, ssl, sys

load_dotenv()

BASE = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(BASE, 'users.db')
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dholakpur-python-lab-change-me')

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
OTP_TTL_MINUTES = 10

def smtp_ready():
    host = (os.environ.get('SMTP_HOST') or '').strip()
    user = (os.environ.get('SMTP_USER') or '').strip()
    password = os.environ.get('SMTP_PASSWORD') or ''
    placeholder_users = {'yourgmail@gmail.com', 'example@gmail.com'}
    placeholder_passwords = {'your_16_character_app_password', 'your_app_password'}
    if not host or not user or not password:
        return False
    if user.lower() in placeholder_users or password in placeholder_passwords:
        return False
    return True

def smtp_status():
    return {
        'configured': smtp_ready(),
        'host': os.environ.get('SMTP_HOST') or '',
        'port': int(os.environ.get('SMTP_PORT', '587')),
        'user': os.environ.get('SMTP_USER') or '',
        'from_email': os.environ.get('SMTP_FROM') or os.environ.get('SMTP_USER') or '',
    }

def friendly_smtp_error(exc):
    msg = str(exc) or exc.__class__.__name__
    if '535' in msg or '5.7.80' in msg:
        return 'SMTP login failed (535). For Gmail, use a Google App Password with 2-Step Verification enabled; do not use your normal Gmail password.'
    if '534' in msg or '5.7.90' in msg:
        return 'Gmail requires an App Password for this SMTP connection. Turn on 2-Step Verification and create an App Password.'
    if 'timed out' in msg.lower():
        return 'SMTP connection timed out. Check your internet connection, SMTP host and port.'
    if 'Name or service not known' in msg or 'getaddrinfo failed' in msg:
        return 'SMTP host could not be reached. Check SMTP_HOST.'
    if 'authentication' in msg.lower():
        return 'SMTP authentication failed. Check the sender email and App Password.'
    return f'Email could not be sent: {msg[:240]}'

def save_env_value(key, value):
    env_path = os.path.join(BASE, '.env')
    lines = []
    if os.path.exists(env_path):
        lines = open(env_path, 'r', encoding='utf-8').read().splitlines()
    found = False
    for i, line in enumerate(lines):
        if line.startswith(key + '='):
            lines[i] = key + '=' + value
            found = True
            break
    if not found:
        lines.append(key + '=' + value)
    with open(env_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines).rstrip() + '\n')
    os.environ[key] = value

def send_code_email(to_email, code, subject='Dholakpur Python Hero Lab - Verification Code', purpose='email verification'):
    if not smtp_ready():
        raise RuntimeError('Email verification is not configured. Add SMTP_HOST, SMTP_USER and SMTP_PASSWORD to your .env file.')
    host = os.environ.get('SMTP_HOST')
    port = int(os.environ.get('SMTP_PORT', '587'))
    user = os.environ.get('SMTP_USER')
    password = os.environ.get('SMTP_PASSWORD')
    sender = os.environ.get('SMTP_FROM') or user
    use_tls = os.environ.get('SMTP_USE_TLS', '1').lower() not in ('0','false','no')
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = to_email
    msg.set_content(f'''Dholakpur Python Hero Lab\n\nYour {purpose} code is: {code}\n\nThis code expires in {OTP_TTL_MINUTES} minutes.\nIf you did not request this, you can ignore this email.\n''')
    if port == 465:
        with smtplib.SMTP_SSL(host, port, context=ssl.create_default_context(), timeout=15) as server:
            server.login(user, password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=15) as server:
            if use_tls:
                server.starttls(context=ssl.create_default_context())
            server.login(user, password)
            server.send_message(msg)

def send_verification_code(to_email, code):
    return send_code_email(to_email, code, purpose='email verification')

def db():
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    return c

def init_db():
    c = db()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS lesson_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_no INTEGER NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        completed_at TIMESTAMP,
        UNIQUE(user_id, lesson_no),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS login_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        identifier TEXT NOT NULL,
        success INTEGER NOT NULL,
        ip TEXT,
        login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS login_otps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        email TEXT NOT NULL,
        verification_code TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS pending_registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        verification_code TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    admin = c.execute("SELECT id FROM users WHERE email=?", ('admin@dholakpur.local',)).fetchone()
    if not admin:
        c.execute('INSERT INTO users(name,email,phone,password_hash,role) VALUES(?,?,?,?,?)',
                  ('Administrator','admin@dholakpur.local','',generate_password_hash('admin123'),'admin'))
    c.commit(); c.close()

def current_user():
    return session.get('user')

@app.route('/login', methods=['GET'])
def login_page():
    if current_user():
        return redirect(url_for('admin') if current_user()['role']=='admin' else url_for('home'))
    return render_template('login.html')

@app.route('/register', methods=['GET'])
def register_page():
    if current_user():
        return redirect(url_for('home'))
    return render_template('register.html')

@app.post('/api/register')
def register():
    data = request.get_json(silent=True) or request.form
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    phone = (data.get('phone') or '').strip()
    password = data.get('password') or ''
    if len(name) < 2:
        return jsonify(ok=False, error='Please enter your full name.'), 400
    if not EMAIL_RE.match(email):
        return jsonify(ok=False, error='Please enter a valid email address.'), 400
    if len(password) < 6:
        return jsonify(ok=False, error='Password must contain at least 6 characters.'), 400
    c = db()
    exists = c.execute('SELECT id FROM users WHERE lower(email)=?', (email,)).fetchone()
    if exists:
        c.close(); return jsonify(ok=False,error='An account with this email already exists. Please login.'),409
    if not smtp_ready():
        c.close(); return jsonify(ok=False,error='Account creation is locked until email verification is configured. Add SMTP settings to the .env file and try again.'),503
    code = f"{secrets.randbelow(1000000):06d}"
    try:
        c.execute('DELETE FROM pending_registrations WHERE lower(email)=?', (email,))
        c.execute('''INSERT INTO pending_registrations(name,email,phone,password_hash,verification_code,expires_at)
                     VALUES(?,?,?,?,?,datetime('now', ?))''',
                  (name,email,phone,generate_password_hash(password),code,f'+{OTP_TTL_MINUTES} minutes'))
        c.commit()
        send_verification_code(email, code)
    except Exception:
        c.rollback(); c.close()
        app.logger.exception('Verification email send failed for %s', email)
        return jsonify(ok=False,error=friendly_smtp_error(sys.exc_info()[1])),502
    c.close()
    session['pending_email'] = email
    return jsonify(ok=True, needs_verification=True, email=email)

@app.post('/api/verify-email')
def verify_email():
    data = request.get_json(silent=True) or request.form
    email = (data.get('email') or session.get('pending_email') or '').strip().lower()
    code = (data.get('code') or '').strip()
    if not email or not code:
        return jsonify(ok=False,error='Enter the verification code sent to your email.'),400
    c = db()
    row = c.execute('''SELECT * FROM pending_registrations
                       WHERE lower(email)=? AND verification_code=?
                       AND datetime(expires_at) >= datetime('now')''', (email,code)).fetchone()
    if not row:
        c.close(); return jsonify(ok=False,error='Invalid or expired verification code. Please request a new code.'),400
    try:
        cur=c.execute('''INSERT INTO users(name,email,phone,password_hash,role) VALUES(?,?,?,?,?)''',
                      (row['name'],row['email'],row['phone'],row['password_hash'],'student'))
        c.execute('DELETE FROM pending_registrations WHERE id=?',(row['id'],))
        c.commit()
    except sqlite3.IntegrityError:
        c.rollback(); c.close(); return jsonify(ok=False,error='An account with this email already exists. Please login.'),409
    c.close()
    session.pop('pending_email', None)
    session.pop('user', None)
    return jsonify(ok=True, redirect=url_for('login_page', verified='1', email=email))

@app.post('/api/resend-verification')
def resend_verification():
    email = ((request.get_json(silent=True) or {}).get('email') or session.get('pending_email') or '').strip().lower()
    if not email: return jsonify(ok=False,error='Enter your email first.'),400
    if not smtp_ready(): return jsonify(ok=False,error='Email verification is not configured. Add SMTP settings to the .env file.'),503
    c=db(); row=c.execute('SELECT * FROM pending_registrations WHERE lower(email)=?',(email,)).fetchone()
    if not row:
        c.close(); return jsonify(ok=False,error='No pending registration was found for this email.'),404
    code=f"{secrets.randbelow(1000000):06d}"
    try:
        c.execute("UPDATE pending_registrations SET verification_code=?, expires_at=datetime('now', ?) WHERE id=?",(code,f'+{OTP_TTL_MINUTES} minutes',row['id']))
        c.commit(); send_verification_code(email,code)
    except Exception:
        c.rollback(); c.close(); app.logger.exception('Verification resend failed for %s', email)
        return jsonify(ok=False,error=friendly_smtp_error(sys.exc_info()[1])),502
    c.close(); session['pending_email']=email
    return jsonify(ok=True,message='A new verification code has been sent.')

@app.get('/api/admin/email-status')
def admin_email_status():
    if not current_user() or current_user()['role'] != 'admin':
        return jsonify(ok=False,error='Unauthorized'),403
    return jsonify(ok=True, **smtp_status())

@app.post('/api/admin/save-email-settings')
def save_email_settings():
    if not current_user() or current_user()['role'] != 'admin':
        return jsonify(ok=False,error='Unauthorized'),403
    data=request.get_json(silent=True) or request.form
    host=(data.get('host') or 'smtp.gmail.com').strip()
    port=str(data.get('port') or '587').strip()
    user=(data.get('user') or '').strip()
    password=data.get('password') or ''
    from_email=(data.get('from_email') or user).strip()
    use_tls='1' if str(data.get('use_tls','1')).lower() not in ('0','false','no') else '0'
    if not host or not user:
        return jsonify(ok=False,error='Enter the sender email and SMTP host.'),400
    try:
        int(port)
    except ValueError:
        return jsonify(ok=False,error='SMTP port must be a number.'),400
    if not password and not os.environ.get('SMTP_PASSWORD'):
        return jsonify(ok=False,error='Enter the SMTP password. For Gmail, use a Google App Password.'),400
    for k,v in [('SMTP_HOST',host),('SMTP_PORT',port),('SMTP_USER',user),('SMTP_FROM',from_email),('SMTP_USE_TLS',use_tls)]:
        save_env_value(k,v)
    if password:
        save_env_value('SMTP_PASSWORD',password)
    return jsonify(ok=True,message='Email settings saved. Use Test Email below to verify them.',**smtp_status())

@app.post('/api/admin/test-email')
def admin_test_email():
    if not current_user() or current_user()['role'] != 'admin':
        return jsonify(ok=False,error='Unauthorized'),403
    if not smtp_ready():
        return jsonify(ok=False,error='Email sender is not configured yet. Save the SMTP settings first.'),503
    data=request.get_json(silent=True) or request.form
    to_email=(data.get('to_email') or '').strip()
    if not EMAIL_RE.match(to_email):
        return jsonify(ok=False,error='Enter a valid test recipient email address.'),400
    code=f"{secrets.randbelow(1000000):06d}"
    try:
        send_verification_code(to_email, code)
    except Exception as exc:
        app.logger.exception('Test email failed')
        return jsonify(ok=False,error=friendly_smtp_error(exc)),502
    return jsonify(ok=True,message=f'Test email sent to {to_email}. Check Inbox and Spam/Junk.')

@app.post('/api/login')
def login():
    # Keep admin password login for the separate admin account.
    data = request.get_json(silent=True) or request.form
    identifier = (data.get('identifier') or data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    c = db()
    row = c.execute('SELECT * FROM users WHERE lower(email)=? OR phone=?', (identifier, identifier)).fetchone()
    if not row or row['role'] != 'admin' or not check_password_hash(row['password_hash'], password):
        uid = row['id'] if row else None
        c.execute('INSERT INTO login_logs(user_id,identifier,success,ip) VALUES(?,?,0,?)', (uid,identifier,request.remote_addr))
        c.commit(); c.close()
        return jsonify(ok=False,error='For student login, use Email OTP. Admin uses the password login.'),401
    c.execute('UPDATE users SET last_login=CURRENT_TIMESTAMP WHERE id=?',(row['id'],))
    c.execute('INSERT INTO login_logs(user_id,identifier,success,ip) VALUES(?,?,1,?)',(row['id'],identifier,request.remote_addr))
    c.commit(); c.close()
    session['user']={'id':row['id'],'name':row['name'],'email':row['email'],'role':row['role']}
    return jsonify(ok=True, user=session['user'], redirect=url_for('admin'))

@app.post('/api/send-login-otp')
def send_login_otp():
    data = request.get_json(silent=True) or request.form
    email = (data.get('email') or '').strip().lower()
    if not EMAIL_RE.match(email):
        return jsonify(ok=False, error='Enter a valid email address.'), 400
    if not smtp_ready():
        return jsonify(ok=False, error='OTP email is not configured. Ask the admin to configure SMTP email settings first.'), 503
    c = db()
    row = c.execute("SELECT * FROM users WHERE lower(email)=? AND role='student'", (email,)).fetchone()
    if not row:
        c.close()
        return jsonify(ok=False, error='No student account exists with this email. Create an account first.'), 404
    code = f"{secrets.randbelow(1000000):06d}"
    try:
        c.execute('DELETE FROM login_otps WHERE lower(email)=?', (email,))
        c.execute("INSERT INTO login_otps(user_id,email,verification_code,expires_at) VALUES(?,?,?,datetime('now', ?))",
                  (row['id'], email, code, f'+{OTP_TTL_MINUTES} minutes'))
        c.commit()
        send_code_email(email, code, subject='Dholakpur Python Hero Lab - Login OTP', purpose='login')
    except Exception as exc:
        c.rollback(); c.close()
        app.logger.exception('Login OTP send failed for %s', email)
        return jsonify(ok=False, error=friendly_smtp_error(exc)), 502
    c.close()
    session['pending_login_email'] = email
    return jsonify(ok=True, email=email, message=f'Login OTP sent to {email}. Check your Inbox and Spam/Junk.')

@app.post('/api/verify-login-otp')
def verify_login_otp():
    data = request.get_json(silent=True) or request.form
    email = (data.get('email') or session.get('pending_login_email') or '').strip().lower()
    code = (data.get('code') or '').strip()
    if not email or not code:
        return jsonify(ok=False, error='Enter the login OTP sent to your email.'), 400
    c = db()
    row = c.execute('''SELECT o.*, u.name, u.role FROM login_otps o
                       JOIN users u ON u.id=o.user_id
                       WHERE lower(o.email)=? AND o.verification_code=?
                       AND datetime(o.expires_at) >= datetime('now')
                       AND u.role='student' ''', (email, code)).fetchone()
    if not row:
        uid_row = c.execute("SELECT id FROM users WHERE lower(email)=? AND role='student'", (email,)).fetchone()
        c.execute('INSERT INTO login_logs(user_id,identifier,success,ip) VALUES(?,?,0,?)',
                  (uid_row['id'] if uid_row else None, email, request.remote_addr))
        c.commit(); c.close()
        return jsonify(ok=False, error='Invalid or expired login OTP. Please request a new code.'), 400
    c.execute('UPDATE users SET last_login=CURRENT_TIMESTAMP WHERE id=?', (row['user_id'],))
    c.execute('INSERT INTO login_logs(user_id,identifier,success,ip) VALUES(?,?,1,?)',
              (row['user_id'], email, request.remote_addr))
    c.execute('DELETE FROM login_otps WHERE user_id=?', (row['user_id'],))
    c.commit(); c.close()
    session.pop('pending_login_email', None)
    session['user']={'id':row['user_id'],'name':row['name'],'email':email,'role':'student'}
    return jsonify(ok=True, user=session['user'], redirect=url_for('home'))

@app.post('/api/logout')
def logout():
    session.clear(); return jsonify(ok=True)

@app.route('/')
def home():
    if not current_user():
        return redirect(url_for('login_page'))
    return render_template('index.html', user=current_user())


@app.get('/api/progress')
def get_progress():
    if not current_user() or current_user()['role'] != 'student':
        return jsonify(ok=False, error='Unauthorized'), 401
    c=db(); rows=c.execute('SELECT lesson_no FROM lesson_progress WHERE user_id=? AND completed=1',(current_user()['id'],)).fetchall(); c.close()
    return jsonify(ok=True, completed=[r['lesson_no'] for r in rows])

@app.post('/api/progress/<int:lesson_no>/complete')
def complete_progress(lesson_no):
    if not current_user() or current_user()['role'] != 'student':
        return jsonify(ok=False, error='Unauthorized'), 401
    if lesson_no < 1 or lesson_no > 40:
        return jsonify(ok=False, error='Invalid lesson number'), 400
    c=db(); c.execute('''INSERT INTO lesson_progress(user_id,lesson_no,completed,completed_at) VALUES(?,?,1,CURRENT_TIMESTAMP)
                         ON CONFLICT(user_id,lesson_no) DO UPDATE SET completed=1, completed_at=CURRENT_TIMESTAMP''',(current_user()['id'],lesson_no)); c.commit(); c.close()
    return jsonify(ok=True, lesson_no=lesson_no)

@app.post('/api/admin/change-password')
def admin_change_password():
    if not current_user() or current_user()['role'] != 'admin':
        return jsonify(ok=False,error='Unauthorized'),403
    data=request.get_json(silent=True) or request.form
    old=data.get('current_password') or ''
    new=data.get('new_password') or ''
    if len(new) < 8:
        return jsonify(ok=False,error='New password must contain at least 8 characters.'),400
    c=db(); row=c.execute("SELECT password_hash FROM users WHERE id=? AND role='admin'",(current_user()['id'],)).fetchone()
    if not row or not check_password_hash(row['password_hash'],old):
        c.close(); return jsonify(ok=False,error='Current password is incorrect.'),400
    c.execute('UPDATE users SET password_hash=? WHERE id=?',(generate_password_hash(new),current_user()['id'])); c.commit(); c.close()
    return jsonify(ok=True)

@app.route('/admin')
def admin():
    if not current_user() or current_user()['role'] != 'admin':
        return redirect(url_for('login_page'))
    c=db()
    users_rows=c.execute('''SELECT u.id,u.name,u.email,u.phone,u.role,u.created_at,u.last_login,
                      (SELECT COUNT(*) FROM lesson_progress p WHERE p.user_id=u.id AND p.completed=1) AS completed_lessons
                      FROM users u ORDER BY u.id DESC''').fetchall()
    # Build per-student progress for the 4 course modules (10 lessons each).
    users=[]
    student_progress=[]
    for r in users_rows:
        uid=r['id']
        m1=c.execute('SELECT COUNT(*) FROM lesson_progress WHERE user_id=? AND completed=1 AND lesson_no BETWEEN 1 AND 10',(uid,)).fetchone()[0]
        m2=c.execute('SELECT COUNT(*) FROM lesson_progress WHERE user_id=? AND completed=1 AND lesson_no BETWEEN 11 AND 20',(uid,)).fetchone()[0]
        m3=c.execute('SELECT COUNT(*) FROM lesson_progress WHERE user_id=? AND completed=1 AND lesson_no BETWEEN 21 AND 30',(uid,)).fetchone()[0]
        m4=c.execute('SELECT COUNT(*) FROM lesson_progress WHERE user_id=? AND completed=1 AND lesson_no BETWEEN 31 AND 40',(uid,)).fetchone()[0]
        item=dict(r)
        item['module_progress']=[m1,m2,m3,m4]
        users.append(item)
        if r['role']=='student':
            student_progress.append({'id':r['id'],'name':r['name'],'email':r['email'],'completed':r['completed_lessons'],'modules':[m1,m2,m3,m4]})
    logs=c.execute('''SELECT l.id,l.identifier,l.success,l.ip,l.login_at,u.name,u.email
                      FROM login_logs l LEFT JOIN users u ON u.id=l.user_id
                      ORDER BY l.id DESC LIMIT 100''').fetchall()
    total_users = c.execute("SELECT COUNT(*) FROM users WHERE role!='admin'").fetchone()[0]
    active_users = c.execute("SELECT COUNT(*) FROM users WHERE role!='admin' AND last_login IS NOT NULL").fetchone()[0]
    today_users = c.execute("SELECT COUNT(*) FROM users WHERE role!='admin' AND date(created_at)=date('now','localtime')").fetchone()[0]
    successful_logins = c.execute("SELECT COUNT(*) FROM login_logs WHERE success=1").fetchone()[0]
    failed_logins = c.execute("SELECT COUNT(*) FROM login_logs WHERE success=0").fetchone()[0]
    completed_lessons = c.execute("SELECT COUNT(*) FROM lesson_progress WHERE completed=1").fetchone()[0]
    c.close()
    stats = {
        'total_users': total_users,
        'active_users': active_users,
        'today_users': today_users,
        'successful_logins': successful_logins,
        'failed_logins': failed_logins,
        'completed_lessons': completed_lessons,
    }
    return render_template('admin.html',users=users,logs=logs,stats=stats,user=current_user(),student_progress=student_progress)

@app.post('/api/admin/delete/<int:user_id>')
def delete_user(user_id):
    if not current_user() or current_user()['role']!='admin':
        return jsonify(ok=False,error='Unauthorized'),403
    c=db(); c.execute("DELETE FROM users WHERE id=? AND role!='admin'",(user_id,)); c.commit(); c.close()
    return jsonify(ok=True)

init_db()

if __name__=='__main__':
    app.run(host='127.0.0.1', port=int(os.environ.get('PORT',5000)), debug=False)
