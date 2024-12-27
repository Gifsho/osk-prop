let activeInput = null;
let isDragging = false;
let offsetX = 0,
  offsetY = 0;
let isCapsLock = false;
let isShift = false;
let currentLanguage = "english";
const encryptionKey = "1234567890123456";

// เพิ่ม event listener
document
  .querySelectorAll("input, textarea, form")
  .forEach((element) => {
    element.addEventListener("focus", (event) => {
      event.stopImmediatePropagation();
      activeInput = element;
    });
  });

// แสดง-ซ่อนคีย์บอร์ด
function toggleKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.style.display = keyboard.style.display === "flex" ? "none" : "flex";
}

function encryptText(text) {
  return CryptoJS.AES.encrypt(text, encryptionKey).toString();
}

function handleKeyPress(keyElement) {
  if (activeInput) {
    let keyToAdd;
    if (isShift) {
      keyToAdd =
        keyElement.getAttribute("data-shifted") ||
        keyElement.innerText.toUpperCase();
    } else if (isCapsLock) {
      keyToAdd =
        keyElement.getAttribute("data-shifted") ||
        keyElement.innerText.toUpperCase();
    } else {
      keyToAdd = keyElement.getAttribute("data-normal") || keyElement.innerText;
    }

    // เข้ารหัสข้อความที่กด
    const encryptedKey = encryptText(keyToAdd);

    // เพิ่มข้อความที่เข้ารหัสลงใน input
    activeInput.value += keyToAdd;

    activeInput.setAttribute("data-encrypted-value", encryptedKey);

    if (isShift && !isCapsLock) {
      toggleShift();
    }

    console.log("Encrypted input: ", activeInput.getAttribute("data-encrypted-value"));
  }
}

function toggleCapsLock() {
  isCapsLock = !isCapsLock;
  const capsLockKeys = document.querySelectorAll(".capslock");
  capsLockKeys.forEach((key) => key.classList.toggle("caps-active"));

  document.querySelectorAll(".key").forEach((key) => {
    const normalText = key.getAttribute("data-normal");
    const shiftedText = key.getAttribute("data-shifted");

    if (isCapsLock) {
      if (shiftedText) {
        key.innerText = shiftedText;
      } else if (normalText && normalText.match(/[a-zA-Z]/)) {
        key.innerText = normalText.toUpperCase();
      }
    } else {
      if (normalText) {
        key.innerText = normalText;
      }
    }
  });
}

function toggleShift() {
  isShift = !isShift;
  const shiftKeys = document.querySelectorAll(".shift");
  shiftKeys.forEach((key) => key.classList.toggle("shift-active"));

  document.querySelectorAll(".key").forEach((key) => {
    const normalText = key.getAttribute("data-normal");
    const shiftedText = key.getAttribute("data-shifted");

    if (isShift) {
      if (shiftedText) {
        key.innerText = shiftedText;
      } else if (normalText && normalText.match(/[a-zA-Z]/)) {
        key.innerText = normalText.toUpperCase();
      }
    } else {
      if (normalText) {
        key.innerText = normalText;
      }
    }
  });
}

function backspace() {
  if (activeInput && activeInput.value.length > 0) {
    activeInput.value = activeInput.value.slice(0, -1);
  }
}

function Tab() {
  if (activeInput) {
    let start = activeInput.selectionStart;
    let end = activeInput.selectionEnd;

    activeInput.value = activeInput.value.substring(0, start) + "    " + activeInput.value.substring(end);

    activeInput.selectionStart = activeInput.selectionEnd = start + 4;
  }
}

// จัดการการลากคีย์บอร์ด
function startDrag(event) {
  isDragging = true;
  offsetX = event.clientX - document.getElementById("keyboard").offsetLeft;
  offsetY = event.clientY - document.getElementById("keyboard").offsetTop;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.removeEventListener("mousemove", drag);
  });
}

function drag(event) {
  if (isDragging) {
    const keyboard = document.getElementById("keyboard");
    keyboard.style.left = `${event.clientX - offsetX}px`;
    keyboard.style.top = `${event.clientY - offsetY}px`;
  }
}

function switchLanguage() {
  const numpadKeyboard = document.getElementById("numpad-keyboard");
  const scrambledKeyboard = document.getElementById("scrambled-keyboard");
  const engScramble = document.getElementById("english-Scramble");
  const thaiScramble = document.getElementById("thai-Scramble");

  // สลับค่า currentLanguage
  currentLanguage = currentLanguage === "english" ? "thai" : "english";

  // แสดงคีย์บอร์ดตามภาษา
  document.getElementById("english-keyboard").style.display =
    currentLanguage === "english" ? "block" : "none";
  document.getElementById("thai-keyboard").style.display =
    currentLanguage === "thai" ? "block" : "none";

  // ซ่อนคีย์บอร์ดอื่นๆ
  numpadKeyboard.style.display = "none";
  scrambledKeyboard.style.display = "none";
  thaiScramble.style.display = "none";
  engScramble.style.display = "none";
}

async function login(event) {
  event.preventDefault();

  // ดึงค่าที่เข้ารหัสจากฟอร์ม
  const encryptedUsername = document.getElementById("u___n___").value;
  const encryptedPassword = document.getElementById("p___w___").value;

  // เข้ารหัสข้อมูลก่อนส่งไปยังเซิร์ฟเวอร์
  const encryptedu___n___ = encryptText(encryptedUsername);
  const encryptedp___w___ = encryptText(encryptedPassword);

  const loginData = {
    u___n___: encryptedu___n___,
    p___w___: encryptedp___w___,
  };

  // ส่งข้อมูลที่เข้ารหัสไปยังเซิร์ฟเวอร์
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (data.token) {
    alert("เข้าสู่ระบบสำเร็จ");
    localStorage.setItem("token", data.token);
  } else {
    alert(data.message || "เกิดข้อผิดพลาด");
  }
}

// ปลี่ยนสีพื้นหลัง
function toggletap(event) {
  const key = event.target;
  key.style.backgroundColor = "#45a049";

  setTimeout(() => {
    key.style.backgroundColor = "#d3d3d3";
  }, 100);
  console.log("Tap function");
}

function toggleEnter(event) {
  // ตรวจสอบว่าเป็นการกดปุ่ม Enter
  if (event.key === "Enter") {
    // ป้องกันการส่งฟอร์มที่เกิดจากการกด Enter
    event.preventDefault();

    // เช็คว่า activeInput มีค่าและเป็นประเภท INPUT
    if (activeInput && activeInput.tagName === "INPUT") {
      // ส่งฟอร์มเมื่อกด Enter
      activeInput.form.submit();
      console.log("Form submitted using Enter.");
    }
  }
}

function Numpad() {
  const englishKeyboard = document.getElementById("english-keyboard");
  const thaiKeyboard = document.getElementById("thai-keyboard");
  const scrambledKeyboard = document.getElementById("scrambled-keyboard");
  const numpadKeyboard = document.getElementById("numpad-keyboard");
  const engScramble = document.getElementById("english-Scramble");
  const thaiScramble = document.getElementById("thai-Scramble");

  englishKeyboard.style.display = "none";
  thaiKeyboard.style.display = "none";
  scrambledKeyboard.style.display = "none";
  thaiScramble.style.display = "none";
  engScramble.style.display = "none";

  if (numpadKeyboard) {
    numpadKeyboard.style.display = "block";
  } else {
    alert("Numpad layout is not available");
  }
}

function Scramble() {
  const englishKeyboard = document.getElementById("english-keyboard");
  const thaiKeyboard = document.getElementById("thai-keyboard");
  const scrambledKeyboard = document.getElementById("scrambled-keyboard");
  const numpadKeyboard = document.getElementById("numpad-keyboard");
  const engScramble = document.getElementById("english-Scramble");
  const thaiScramble = document.getElementById("thai-Scramble");

  // ซ่อนคีย์บอร์ดทุกตัวที่ไม่ใช่ Scrambled
  englishKeyboard.style.display = "none";
  thaiKeyboard.style.display = "none";
  numpadKeyboard.style.display = "none";
  thaiScramble.style.display = "none";
  engScramble.style.display = "none";

  if (scrambledKeyboard) {
    scrambledKeyboard.style.display = "block";
    scrambleKeys(); // เรียกฟังก์ชันเพื่อสุ่มตัวเลขบนคีย์บอร์ด
  } else {
    alert("Scramble layout is not available");
  }
}

function scrambleKeys() {
  // เลือกปุ่มทั้งหมดในคีย์บอร์ด "Scrambled" ยกเว้นปุ่ม backspace
  const keys = document.querySelectorAll(
    "#scrambled-keyboard .key:not(.backspace):not(.plus):not(.minus):not(.multiply):not(.divide):not(.modulo):not(.double-zero):not(.decimal):not(.equals)"
  );
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  shuffleArray(numbers); // เรียงลำดับตัวเลขแบบสุ่ม

  keys.forEach((key, index) => {
    key.textContent = numbers[index];
  });
}

// ฟังก์ชัน scramble สำหรับภาษาไทยและภาษาอังกฤษ
function scrambleLanguage(language) {
  const englishKeyboard = document.getElementById("english-keyboard");
  const thaiKeyboard = document.getElementById("thai-keyboard");
  const scrambledKeyboard = document.getElementById("scrambled-keyboard");
  const numpadKeyboard = document.getElementById("numpad-keyboard");
  const engScramble = document.getElementById("english-Scramble");
  const thaiScramble = document.getElementById("thai-Scramble");

  if (language === "thai") {
    englishKeyboard.style.display = "none";
    thaiKeyboard.style.display = "none";
    engScramble.style.display = "none";
    numpadKeyboard.style.display = "none";
    scrambledKeyboard.style.display = "none";
    thaiScramble.style.display = "block";
    scrambleThaiKeys(); // ฟังก์ชันสำหรับภาษาไทย
  } else if (language === "english") {
    englishKeyboard.style.display = "none";
    thaiKeyboard.style.display = "none";
    engScramble.style.display = "block";
    numpadKeyboard.style.display = "none";
    scrambledKeyboard.style.display = "none";
    thaiScramble.style.display = "none";
    scrambleEnglishKeys(); // ฟังก์ชันสำหรับภาษาอังกฤษ
  }
}

// ฟังก์ชัน scramble สำหรับคีย์บอร์ดภาษาอังกฤษ
function scrambleEnglishKeys() {
  const keys = document.querySelectorAll(
    "#english-Scramble .key:not(.backspace):not(.capslock):not(.enter):not(.shift):not(.space-bar)"
  );

  const englishAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  shuffleArray(englishAlphabet);

  keys.forEach((key, index) => {
    if (index < englishAlphabet.length) {
      key.textContent = englishAlphabet[index];
      key.setAttribute("data-normal", englishAlphabet[index]);
      key.setAttribute("data-shifted", englishAlphabet[index].toUpperCase());
    } else {
      key.textContent = "";
    }
  });
}

// ฟังก์ชัน scramble สำหรับคีย์บอร์ดภาษาไทย
function scrambleThaiKeys() {
  const keys = document.querySelectorAll(
    "#thai-Scramble .key:not(.backspace):not(.capslock):not(.enter):not(.shift):not(.space-bar)"
  );
  const thaiAlphabet = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮ".split(
    ""
  );
  shuffleArray(thaiAlphabet);

  keys.forEach((key, index) => {
    if (index < thaiAlphabet.length) {
      key.textContent = thaiAlphabet[index];
      key.setAttribute("data-normal", thaiAlphabet[index]);
      key.setAttribute("data-shifted", thaiAlphabet[index]);
    } else {
      key.textContent = "";
    }
  });
}

// ฟังก์ชันเพื่อสับเปลี่ยนตัวอักษร
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function changeDropdownName(name) {
  const dropdownButton = document.getElementById("dropdownButton");
  dropdownButton.textContent = name;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("click", (event) => {
      if (key.classList.contains("capslock")) {
        toggleCapsLock();
      } else if (key.classList.contains("tab")) {
        Tab();
      } else if (key.classList.contains("backspace")) {
        backspace();
      } else if (key.classList.contains("shift")) {
        toggleShift();
      } else if (key.classList.contains("enter")) {
        toggleEnter();
      } else if (key.classList.contains("toggle-lang")) {
        switchLanguage();
      } else {
        handleKeyPress(key);
      }
    });
  });

  const loginButton = document.getElementById("login-button");
  const toggleKeyboards = document.getElementById("toggleKeyboard");

  loginButton.addEventListener("click", login);
  toggleKeyboards.addEventListener("click", toggleKeyboard);

  document
    .getElementById("switch-toggle")
    .addEventListener("click", switchLanguage);
  document.getElementById("numpad-toggle").addEventListener("click", Numpad);
  document
    .getElementById("scramble-toggle")
    .addEventListener("click", Scramble);
  document
    .getElementById("scramble-toggle-thai")
    .addEventListener("click", () => scrambleLanguage("thai"));
  document
    .getElementById("scramble-toggle-eng")
    .addEventListener("click", () => scrambleLanguage("english"));
});

// ฟังก์ชันหลักในการป้องกันการจับภาพหน้าจอในเบราว์เซอร์
function preventScreenCapture() {
  const overrideFunction = (target, method, handler) => {
      if (target && target[method]) {
          const original = target[method];
          target[method] = function (...args) {
              handler();
              return Promise.reject("Screen capture blocked.");
          };
      }
  };

  // ตรวจสอบความพร้อมใช้งานของ navigator.mediaDevices และ getDisplayMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      // ป้องกันการใช้งาน getDisplayMedia
      overrideFunction(navigator.mediaDevices, 'getDisplayMedia', () => {
          console.log('Screen capture attempt detected via getDisplayMedia!');
          showBlackScreen(true);
      });
  }

  // ตรวจสอบความพร้อมใช้งานของ navigator.mediaDevices และ getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // ป้องกันการใช้งาน getUserMedia
      overrideFunction(navigator.mediaDevices, 'getUserMedia', () => {
          console.log('Screen capture attempt detected via getUserMedia!');
          showBlackScreen(true);
      });
  }

  // ป้องกันคีย์ลัด PrintScreen, Win+Shift+S และอื่นๆ
  document.addEventListener('keydown', (event) => {
      if (event.key === 'PrintScreen' || (event.key === 'S' && event.shiftKey && event.metaKey)) {
          console.log('Blocked PrintScreen or Win+Shift+S key.');
          event.preventDefault();
      }
  });

  // ตรวจจับการใช้งาน screen capture ของ third-party logger
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

// ฟังก์ชันเพื่อแสดงหน้าจอสีดำ
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
// เรียกใช้งานฟังก์ชัน
preventScreenCapture();
preventKeyLogger();