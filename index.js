require('dotenv').config();  // โหลด dotenv เพื่อใช้งานตัวแปรใน .env

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");  // สำหรับใช้ path ในการตั้งค่า static files
const { exec } = require('child_process');
const app = express();
const PORT = 3000;

// ใช้ SECRET_KEY จาก .env
const SECRET_KEY = process.env.SECRET_KEY;

app.use(bodyParser.json());

// กำหนดให้ Express เสิร์ฟไฟล์จากโฟลเดอร์ "public"
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose
  .connect("mongodb+srv://yossy:UCm53aKnr9kzdtUj@cluster0.rj3m9.mongodb.net/OSKDB?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error("MongoDB Connection error:", error));

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  u___n___: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  p___w___: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Register Endpoint
app.post("/register", async (req, res) => {
  try {
    const { u___n___, email, p___w___ } = req.body;

    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
    const existingUser = await User.findOne({ $or: [{ u___n___ }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "ผู้ใช้มีอยู่แล้ว" });
    }

    // Salted และ Hash รหัสผ่าน
    const saltRounds = 10;
    const hashedp___w___ = await bcrypt.hash(p___w___, saltRounds);

    // สร้างผู้ใช้ใหม่
    const newUser = new User({ u___n___, email, p___w___: hashedp___w___ });
    await newUser.save();

    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก", error });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  try {
    const { u___n___, p___w___ } = req.body;

    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const user = await User.findOne({ u___n___ });
    if (!user) {
      return res.status(400).json({ message: "ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง" });
    }

    // ตรวจสอบรหัสผ่าน
    const ispasswordValid = await bcrypt.compare(p___w___, user.p___w___);
    if (!ispasswordValid) {
      return res.status(400).json({ message: "ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง" });
    }

    // สร้าง JWT Token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ", error });
  }
});


// 1. Detect and Block Third-party Software (Windows)
function detectThirdPartySoftware() {
  const knownProcesses = ['snagit32.exe', 'gyazowin.exe', 'lightshot.exe', 'greenshot.exe'];
  exec('tasklist', (err, stdout, stderr) => {
      if (err) {
          console.error('Error detecting processes:', err);
          return;
      }

      const runningProcesses = stdout.toLowerCase();
      knownProcesses.forEach(process => {
          if (runningProcesses.includes(process.toLowerCase())) {
              console.warn(`Warning: Detected third-party screen capture software: ${process}`);
              preventScreenLogger();
          }
      });
  });
}

function preventScreenLogger() {
  const commands = [
      'Stop-Process -Name *logger* -Force',
      'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "DisableSnippingTool" -Value 1',
      'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" -Name "AppCaptureEnabled" -Value 0',
      'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" -Name "IsGameDVR_Enabled" -Value 0'
  ];

  exec(`powershell -Command "${commands.join('; ')}"`, (err) => {
      if (err) {
          console.error('Error executing PowerShell commands:', err);
      } else {
          console.log('Windows screen capture tools disabled.');
      }
  });
}

// 2. Prevent Screen Capture in Browsers
function preventScreenCapture() {
  const overrideFunction = (target, method, handler) => {
      if (target[method]) {
          const original = target[method];
          target[method] = function (...args) {
              handler();
              return Promise.reject("Screen capture blocked.");
          };
      }
  };

  // Block getDisplayMedia
  overrideFunction(navigator.mediaDevices, 'getDisplayMedia', () => {
      console.log('Screen capture attempt detected via getDisplayMedia!');
      showBlackScreen(true);
  });

  // Block getUserMedia
  overrideFunction(navigator.mediaDevices, 'getUserMedia', () => {
      console.log('Screen capture attempt detected via getUserMedia!');
      showBlackScreen(true);
  });

  // Safari-specific blocking
  if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
      console.log('Safari detected: Applying screen capture protection');
      navigator.mediaDevices.getUserMedia = () => {
          console.warn('Screen capture blocked on Safari.');
          return Promise.reject("Screen capture is blocked.");
      };
  }

  // Firefox-specific blocking
  if (/Firefox/.test(navigator.userAgent)) {
      console.log('Firefox detected: Applying screen capture protection');
      navigator.mediaDevices.getDisplayMedia = () => {
          console.warn('Screen capture blocked on Firefox.');
          return Promise.reject("Screen capture is blocked.");
      };
  }

  // Windows-specific hotkey blocking
  document.addEventListener('keydown', (event) => {
      if (event.key === 'PrintScreen') {
          console.log('Blocked PrintScreen key.');
          event.preventDefault();
      }
  });

  // Block third-party APIs
  if (navigator.mediaDevices) {
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
      navigator.mediaDevices.getUserMedia = (constraints) => {
          if (constraints && constraints.video && constraints.video.mediaSource === 'screen') {
              console.warn('Screen capture attempt detected!');
              return Promise.reject("Screen capture blocked.");
          }
          return originalGetUserMedia.call(navigator.mediaDevices, constraints);
      };
  }
}

// 3. Prevent Keylogger
function preventKeyLogger() {
  const blockLoggingKeys = ['Shift', 'Ctrl', 'Alt', 'Meta', 'F12'];

  // Block key events
  document.addEventListener('keydown', (event) => {
      if (blockLoggingKeys.includes(event.key) || event.key.length === 1) {
          console.log(`Keylogger protection: Blocked key "${event.key}"`);
          event.stopImmediatePropagation();
          event.preventDefault();
      }
  });

  // Detect and prevent input logging
  document.addEventListener('input', (event) => {
      const inputSource = event.target;
      if (inputSource && inputSource.tagName === 'INPUT') {
          console.warn('Keylogger attempt detected!');
          inputSource.value = ''; // Clear logged input
      }
  });
}

// 4. Show Detection Alerts
function showDetectionAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '0';
  alertDiv.style.left = '0';
  alertDiv.style.width = '100%';
  alertDiv.style.padding = '20px';
  alertDiv.style.backgroundColor = 'red';
  alertDiv.style.color = 'white';
  alertDiv.style.textAlign = 'center';
  alertDiv.style.zIndex = '9999';
  alertDiv.textContent = message;

  document.body.appendChild(alertDiv);

  setTimeout(() => alertDiv.remove(), 5000);
}

// 5. Show Black Screen
function showBlackScreen(autoClose = false) {
  const blackScreen = document.createElement('div');
  blackScreen.style.position = 'fixed';
  blackScreen.style.top = 0;
  blackScreen.style.left = 0;
  blackScreen.style.width = '100%';
  blackScreen.style.height = '100%';
  blackScreen.style.backgroundColor = '#000';
  blackScreen.style.zIndex = '9999';
  blackScreen.style.display = 'flex';
  blackScreen.style.alignItems = 'center';
  blackScreen.style.justifyContent = 'center';
  blackScreen.style.color = '#FFF';
  blackScreen.style.fontSize = '24px';
  blackScreen.textContent = 'Screen capture blocked!';

  document.body.appendChild(blackScreen);

  if (autoClose) {
      setTimeout(() => {
          blackScreen.remove();
      }, 3000);
  }
}

// Execute Functions
detectThirdPartySoftware();
preventScreenCapture();
preventKeyLogger();

// ส่งไฟล์ HTML เมื่อเข้าถึง root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
