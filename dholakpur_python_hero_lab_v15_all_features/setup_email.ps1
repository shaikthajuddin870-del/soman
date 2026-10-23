$ErrorActionPreference = 'Stop'
$Base = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvPath = Join-Path $Base '.env'

Write-Host ''
Write-Host '=================================================='
Write-Host ' Dholakpur Python Hero Lab - Gmail OTP Setup'
Write-Host '=================================================='
Write-Host ''
Write-Host 'Before continuing:' -ForegroundColor Yellow
Write-Host '1. Turn on Google 2-Step Verification.'
Write-Host '2. Create a Google App Password for this local app.'
Write-Host '3. Do NOT enter your normal Gmail password here.'
Write-Host ''

$User = Read-Host 'Sender Gmail address'
while ([string]::IsNullOrWhiteSpace($User) -or $User -notmatch '^[^@\s]+@[^@\s]+\.[^@\s]+$') {
  Write-Host 'Please enter a valid Gmail address.' -ForegroundColor Red
  $User = Read-Host 'Sender Gmail address'
}

$Secure = Read-Host 'Gmail App Password (16 characters)' -AsSecureString
$BSTR = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
try { $Password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($BSTR) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR) }
$Password = ($Password -replace '\s','')
while ($Password.Length -lt 16) {
  Write-Host 'That does not look like a 16-character App Password. Try again.' -ForegroundColor Red
  $Secure = Read-Host 'Gmail App Password (16 characters)' -AsSecureString
  $BSTR = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
  try { $Password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($BSTR) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR) }
  $Password = ($Password -replace '\s','')
}

@"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=$User
SMTP_PASSWORD=$Password
SMTP_FROM=$User
SMTP_USE_TLS=1
"@ | Set-Content -Path $EnvPath -Encoding UTF8

Write-Host ''
Write-Host 'Testing Gmail SMTP login...' -ForegroundColor Cyan
$Python = Join-Path $Base '.venv\Scripts\python.exe'
if (-not (Test-Path $Python)) { throw 'Virtual environment is not ready. Please run run.bat first.' }
& $Python (Join-Path $Base 'smtp_test.py')
if ($LASTEXITCODE -ne 0) {
  Write-Host ''
  Write-Host 'SMTP test failed. Your .env was written, but OTP will stay disabled until the credentials are corrected.' -ForegroundColor Red
  Read-Host 'Press Enter to close'
  exit 1
}

Write-Host ''
Write-Host 'Gmail OTP setup is ready! ✅' -ForegroundColor Green
Write-Host 'Now run the website and create a student account.'
Read-Host 'Press Enter to close'
