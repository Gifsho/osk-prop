require('dotenv').config();  // โหลด dotenv เพื่อใช้งานตัวแปรใน .env

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");  // สำหรับใช้ path ในการตั้งค่า static files
const { exec } = require('child_process');
const activeWin = require('active-win');
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

// ฟังก์ชันเพื่อตรวจจับและบล็อกซอฟต์แวร์บุคคลที่สาม
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

// ฟังก์ชันเพื่อป้องกันการจับภาพหน้าจอจาก screen logger
function preventScreenLogger() {
    const commands = [
        'if (!(Test-Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System")) { New-Item -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Force }',
        'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "DisableSnippingTool" -Value 1',
        'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" -Name "AppCaptureEnabled" -Value 0',
        'Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" -Name "IsGameDVR_Enabled" -Value 0',
        'if (Get-Process -Name SnippingTool -ErrorAction SilentlyContinue) { Stop-Process -Name SnippingTool -Force }',
        'if (Get-Process -Name SnipAndSketch -ErrorAction SilentlyContinue) { Stop-Process -Name SnipAndSketch -Force }'
    ];

    exec(`powershell -Command "${commands.join('; ')}"`, (err) => {
        if (err) {
            console.error('Error executing PowerShell commands:', err);
        } else {
            console.log('Windows screen capture tools disabled.');
        }
    });
}

// Function to get the current active window
async function getActiveWindow() {
    const window = await activeWin();
    return window;
}

// Function to monitor changes in the active window
async function monitorActiveWindow() {
    let previousWindow = await getActiveWindow();
    setInterval(async () => {
        const currentWindow = await getActiveWindow();
        if (previousWindow && currentWindow.id !== previousWindow.id) {
            console.log('Active window has changed');
            previousWindow = currentWindow;
            // Handle events when the active window changes
            preventScreenLogger();
        }
    }, 1000); // Check every 1 second
}

// เรียกใช้งานฟังก์ชัน 
detectThirdPartySoftware(); 
monitorActiveWindow();

// ส่งไฟล์ HTML เมื่อเข้าถึง root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
