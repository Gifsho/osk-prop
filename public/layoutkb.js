document.addEventListener("DOMContentLoaded", () => {
    const keyboardContainer = document.createElement("div");
    keyboardContainer.className = "keyboard";
    keyboardContainer.id = "keyboard";
    keyboardContainer.onmousedown = startDrag;
  
    keyboardContainer.innerHTML = `
        <div class="keyboard-container">
            <div class="dropdown">
                <button class="dropdown-button" id="dropdownButton" style="color: black;">เลือกแป้นพิมพ์</button>
                <div class="dropdown-content">
                    <button id="switch-toggle" onclick="changeDropdownName('Switch Language')">Switch Language</button>
                    <button id="numpad-toggle" onclick="changeDropdownName('Numpad Keyboard')">Numpad Keyboard</button>
                    <button id="scramble-toggle" onclick="changeDropdownName('Scramble Numpad')">Scramble Numpad</button>
                    <button id="scramble-toggle-thai" onclick="changeDropdownName('Thai Scramble')">Thai Scramble</button>
                    <button id="scramble-toggle-eng" onclick="changeDropdownName('English Scramble')">English Scramble</button>
                </div>
            </div>
            <div id="english-keyboard" class="keyboard-layout">
                  <!-- English Keyboard Rows -->
                  <div class="keyboard-row">
                      <button class="key" data-normal="%" data-shifted="5">%</button>
                      <button class="key" data-normal="1" data-shifted="!">1</button>
                      <button class="key" data-normal="2" data-shifted="@">2</button>
                      <button class="key" data-normal="3" data-shifted="#">3</button>
                      <button class="key" data-normal="4" data-shifted="$">4</button>
                      <button class="key" data-normal="5" data-shifted="%">5</button>
                      <button class="key" data-normal="6" data-shifted="^">6</button>
                      <button class="key" data-normal="7" data-shifted="&">7</button>
                      <button class="key" data-normal="8" data-shifted="*">8</button>
                      <button class="key" data-normal="9" data-shifted="(">9</button>
                      <button class="key" data-normal="0" data-shifted=")">0</button>
                      <button class="key" data-normal="-" data-shifted="_">-</button>
                      <button class="key" data-normal="=" data-shifted="+">=</button>
                      <button class="key backspace">Backspace</button>  
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key capslock">tap</button>
                      <button class="key" data-normal="q" data-shifted="Q">q</button>
                      <button class="key" data-normal="w" data-shifted="W">w</button>
                      <button class="key" data-normal="e" data-shifted="E">e</button>
                      <button class="key" data-normal="r" data-shifted="R">r</button>
                      <button class="key" data-normal="t" data-shifted="T">t</button>
                      <button class="key" data-normal="y" data-shifted="Y">y</button>
                      <button class="key" data-normal="u" data-shifted="U">u</button>
                      <button class="key" data-normal="i" data-shifted="I">i</button>
                      <button class="key" data-normal="o" data-shifted="O">o</button>
                      <button class="key" data-normal="p" data-shifted="P">p</button>
                      <button class="key" data-normal="[" data-shifted="{">[</button>
                      <button class="key" data-normal="]" data-shifted="}">]</button>
                      <button class="key" data-normal="\\" data-shifted="|">\</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key capslock">CapsLk</button>
                      <button class="key" data-normal="a" data-shifted="A">a</button>
                      <button class="key" data-normal="s" data-shifted="S">s</button>
                      <button class="key" data-normal="d" data-shifted="D">d</button>
                      <button class="key" data-normal="f" data-shifted="F">f</button>
                      <button class="key" data-normal="g" data-shifted="G">g</button>
                      <button class="key" data-normal="h" data-shifted="H">h</button>
                      <button class="key" data-normal="j" data-shifted="J">j</button>
                      <button class="key" data-normal="k" data-shifted="K">k</button>
                      <button class="key" data-normal="l" data-shifted="L">l</button>
                      <button class="key" data-normal=";" data-shifted=":">;</button>
                      <button class="key" data-normal="'" data-shifted="&quot;">'</button>
                      <button class="key enter" style="width: 100px; top:20%">enter</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key shift">Shift</button>
                      <button class="key" data-normal="z" data-shifted="Z">z</button>
                      <button class="key" data-normal="x" data-shifted="X">x</button>
                      <button class="key" data-normal="c" data-shifted="C">c</button>
                      <button class="key" data-normal="v" data-shifted="V">v</button>
                      <button class="key" data-normal="b" data-shifted="B">b</button>
                      <button class="key" data-normal="n" data-shifted="N">n</button>
                      <button class="key" data-normal="m" data-shifted="M">m</button>
                      <button class="key" data-normal="," data-shifted="&lt;">,</button>
                      <button class="key" data-normal="." data-shifted="&gt;">.</button>
                      <button class="key" data-normal="/" data-shifted="?">/</button>
                      <button class="key shift">Shift</button>
                  </div>
  
                  <div class="keyboard-row">
                      <div class="key space-bar"> </div>
                  </div>
              </div>
  
              <div id="thai-keyboard" class="keyboard-layout" style="display: none;">
                  <!-- Thai Keyboard Rows -->
                  <div class="keyboard-row">
                      <button class="key" data-normal="%" data-shifted="%">%</button>
                      <button class="key" data-normal="ๅ" data-shifted="+">ๅ</button>
                      <button class="key" data-normal="/" data-shifted="?">/</button>
                      <button class="key" data-normal="-" data-shifted="_">-</button>
                      <button class="key" data-normal="ภ" data-shifted="ฯ">ภ</button>
                      <button class="key" data-normal="ถ" data-shifted="ฐ">ถ</button>
                      <button class="key" data-normal="ุ" data-shifted="ู">ุ</button>
                      <button class="key" data-normal="ึ" data-shifted="ฺ">ึ</button>
                      <button class="key" data-normal="ค" data-shifted="ฆ">ค</button>
                      <button class="key" data-normal="ต" data-shifted="ฏ">ต</button>
                      <button class="key" data-normal="จ" data-shifted="ฉ">จ</button>
                      <button class="key" data-normal="ข" data-shifted="ฃ">ข</button>
                      <button class="key" data-normal="ช" data-shifted="ฌ">ช</button>
                      <button class="key backspace">Backspace</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key capslock">tap</button>
                      <button class="key" data-normal="ๆ" data-shifted="ๆ">ๆ</button>
                      <button class="key" data-normal="ไ" data-shifted="ใ">ไ</button>
                      <button class="key" data-normal="ำ" data-shifted="ำ">ำ</button>
                      <button class="key" data-normal="พ" data-shifted="ฟ">พ</button>
                      <button class="key" data-normal="ะ" data-shifted="ั">ะ</button>
                      <button class="key" data-normal="ั" data-shifted="๊">ั</button>
                      <button class="key" data-normal="ี" data-shifted="๋">ี</button>
                      <button class="key" data-normal="ร" data-shifted="ฤ">ร</button>
                      <button class="key" data-normal="น" data-shifted="ณ">น</button>
                      <button class="key" data-normal="ย" data-shifted="ญ">ย</button>
                      <button class="key" data-normal="บ" data-shifted="ป">บ</button>
                      <button class="key" data-normal="ล" data-shifted="ฦ">ล</button>
                      <button class="key" data-normal="ฃ" data-shifted="ฅ">ฃ</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key capslock">CapsLock</button>
                      <button class="key" data-normal="ฟ" data-shifted="ข">ฟ</button>
                      <button class="key" data-normal="ห" data-shifted="ผ">ห</button>
                      <button class="key" data-normal="ก" data-shifted="ถ">ก</button>
                      <button class="key" data-normal="ด" data-shifted="โ">ด</button>
                      <button class="key" data-normal="เ" data-shifted="ใ">เ</button>
                      <button class="key" data-normal="้" data-shifted="ฯ">้</button>
                      <button class="key" data-normal="่" data-shifted="๐">่</button>
                      <button class="key" data-normal="า" data-shifted="ฮ">า</button>
                      <button class="key" data-normal="ส" data-shifted="ศ">ส</button>
                      <button class="key" data-normal="ว" data-shifted="ฬ">ว</button>
                      <button class="key" data-normal="ง" data-shifted=".">ง</button>
                      <button class="key capslock">enter</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key shift">Shift</button>
                      <button class="key" data-normal="ผ" data-shifted="ฒ">ผ</button>
                      <button class="key" data-normal="ป" data-shifted="ฬ">ป</button>
                      <button class="key" data-normal="แ" data-shifted="ฤ">แ</button>
                      <button class="key" data-normal="อ" data-shifted="ฦ">อ</button>
                      <button class="key" data-normal="ิ" data-shifted="ๅ">ิ</button>
                      <button class="key" data-normal="ื" data-shifted="ฺ">ื</button>
                      <button class="key" data-normal="ท" data-shifted="ธ">ท</button>
                      <button class="key" data-normal="ม" data-shifted="ฎ">ม</button>
                      <button class="key" data-normal="ใ" data-shifted="ฌ">ใ</button>
                      <button class="key" data-normal="ฝ" data-shifted="ฮ">ฝ</button>
                      <button class="key shift">Shift</button>
                  </div>
  
                  <div class="keyboard-row">
                      <div class="key space-bar"> </div>
                  </div>
              </div>
  
              <div id="numpad-keyboard" class="keyboard-layout" style="display: none;">
                  <div class="keyboard-row">
                      <button class="key">1</button>
                      <button class="key">2</button>
                      <button class="key">3</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key">4</button>
                      <button class="key">5</button>
                      <button class="key">6</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key">7</button>
                      <button class="key">8</button>
                      <button class="key">9</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key">0</button>
                      <button class="key backspace" style="width: 110px;">Backspace</button>
                  </div>
              </div>
  
              <!-- คีย์บอร์ด Scramble -->
              <div id="scrambled-keyboard" class="keyboard-layout" style="display: none;">
                  <!-- เพิ่มปุ่มสำหรับคีย์บอร์ด Scramble -->
                  <div class="keyboard-row">
                      <button class="key">1</button>
                      <button class="key">2</button>
                      <button class="key">3</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key">4</button>
                      <button class="key">5</button>
                      <button class="key">6</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key">7</button>
                      <button class="key">8</button>
                      <button class="key">9</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key">0</button>
                      <button class="key backspace" style="width: 110px;">Backspace</button>
                  </div>
              </div>
  
              <div id="english-Scramble" class="keyboard-layout" style="display: none;">
                  <!-- English Keyboard Rows -->
                  <div class="keyboard-row">
                      <button class="key" data-normal="q" data-shifted="Q">q</button>
                      <button class="key" data-normal="w" data-shifted="W">w</button>
                      <button class="key" data-normal="e" data-shifted="E">e</button>
                      <button class="key" data-normal="r" data-shifted="R">r</button>
                      <button class="key" data-normal="t" data-shifted="T">t</button>
                      <button class="key" data-normal="y" data-shifted="Y">y</button>
                      <button class="key" data-normal="u" data-shifted="U">u</button>
                      <button class="key" data-normal="i" data-shifted="I">i</button>
                      <button class="key" data-normal="o" data-shifted="O">o</button>
                      <button class="key" data-normal="p" data-shifted="P">p</button>
                      <button class="key backspace">Backspace</button>  
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key capslock">CapsLk</button>
                      <button class="key" data-normal="s" data-shifted="S">s</button>
                      <button class="key" data-normal="d" data-shifted="D">d</button>
                      <button class="key" data-normal="f" data-shifted="F">f</button>
                      <button class="key" data-normal="g" data-shifted="G">g</button>
                      <button class="key" data-normal="h" data-shifted="H">h</button>
                      <button class="key" data-normal="j" data-shifted="J">j</button>
                      <button class="key" data-normal="k" data-shifted="K">k</button>
                      <button class="key" data-normal="l" data-shifted="L">l</button>
                      <button class="key enter" style="width: 100px; top:20%">enter</button>
                  </div>
  
                  <div class="keyboard-row">
                      <button class="key shift">Shift</button>
                      <button class="key" data-normal="z" data-shifted="Z">z</button>
                      <button class="key" data-normal="x" data-shifted="X">x</button>
                      <button class="key" data-normal="c" data-shifted="C">c</button>
                      <button class="key" data-normal="v" data-shifted="V">v</button>
                      <button class="key" data-normal="b" data-shifted="B">b</button>
                      <button class="key" data-normal="n" data-shifted="N">n</button>
                      <button class="key" data-normal="m" data-shifted="M">m</button>
                      <button class="key" data-normal="a" data-shifted="A">m</button>
                      <button class="key shift">Shift</button>
                  </div>
  
                  <div class="keyboard-row">
                      <div class="key space-bar"> </div>
                  </div>
              </div>
  
              <div id="thai-Scramble" class="keyboard-layout" style="display: none;">
                  <!-- Thai Keyboard Rows -->
                  <div class="keyboard-row">
                      <button class="key" data-normal="ก" data-shifted="ก">ก</button>
                      <button class="key" data-normal="ข" data-shifted="ข">ข</button>
                      <button class="key" data-normal="ฃ" data-shifted="ฃ">ฃ</button>
                      <button class="key" data-normal="ค" data-shifted="ค">ค</button>
                      <button class="key" data-normal="ฅ" data-shifted="ฅ">ฅ</button>
                      <button class="key" data-normal="ฆ" data-shifted="ฆ">ฆ</button>
                      <button class="key" data-normal="ง" data-shifted="ง">ง</button>
                      <button class="key" data-normal="จ" data-shifted="จ">จ</button>
                      <button class="key" data-normal="ฉ" data-shifted="ฉ">ฉ</button>
                      <button class="key" data-normal="ช" data-shifted="ช">ช</button>
                      <button class="key" data-normal="ซ" data-shifted="ซ">ซ</button>
                      <button class="key" data-normal="ฌ" data-shifted="ฌ">ฌ</button>
                      <button class="key" data-normal="ญ" data-shifted="ญ">ญ</button>
                      <button class="key" data-normal="ฎ" data-shifted="ฎ">ฎ</button>
                      <button class="key backspace">Backspace</button>
                  </div>
                  
                  <div class="keyboard-row">
                      <button class="key" data-normal="ฏ" data-shifted="ฏ">ฏ</button>
                      <button class="key" data-normal="ฐ" data-shifted="ฐ">ฐ</button>
                      <button class="key" data-normal="ฑ" data-shifted="ฑ">ฑ</button>
                      <button class="key" data-normal="ฒ" data-shifted="ฒ">ฒ</button>
                      <button class="key" data-normal="ณ" data-shifted="ณ">ณ</button>
                      <button class="key" data-normal="ด" data-shifted="ด">ด</button>
                      <button class="key" data-normal="ต" data-shifted="ต">ต</button>
                      <button class="key" data-normal="ถ" data-shifted="ถ">ถ</button>
                      <button class="key" data-normal="ท" data-shifted="ท">ท</button>
                      <button class="key" data-normal="ธ" data-shifted="ธ">ธ</button>
                      <button class="key" data-normal="น" data-shifted="น">น</button>
                      <button class="key" data-normal="บ" data-shifted="บ">บ</button>
                      <button class="key" data-normal="ป" data-shifted="ป">ป</button>
                      <button class="key" data-normal="ผ" data-shifted="ผ">ผ</button>
                      <button class="key" data-normal="ฝ" data-shifted="ฝ">ฝ</button>
                      <button class="key" data-normal="พ" data-shifted="พ">พ</button>
                  </div>
                  
                  <div class="keyboard-row">
                      <button class="key" data-normal="ฟ" data-shifted="ฟ">ฟ</button>
                      <button class="key" data-normal="ภ" data-shifted="ภ">ภ</button>
                      <button class="key" data-normal="ม" data-shifted="ม">ม</button>
                      <button class="key" data-normal="ย" data-shifted="ย">ย</button>
                      <button class="key" data-normal="ร" data-shifted="ร">ร</button>
                      <button class="key" data-normal="ฤ" data-shifted="ฤ">ฤ</button>
                      <button class="key" data-normal="ล" data-shifted="ล">ล</button>
                      <button class="key" data-normal="ฦ" data-shifted="ฦ">ฦ</button>
                      <button class="key" data-normal="ว" data-shifted="ว">ว</button>
                      <button class="key" data-normal="ศ" data-shifted="ศ">ศ</button>
                      <button class="key" data-normal="ษ" data-shifted="ษ">ษ</button>
                      <button class="key" data-normal="ส" data-shifted="ส">ส</button>
                      <button class="key" data-normal="ห" data-shifted="ห">ห</button>
                      <button class="key" data-normal="ฬ" data-shifted="ฬ">ฬ</button>
                      <button class="key" data-normal="อ" data-shifted="อ">อ</button>
                      <button class="key" data-normal="ฮ" data-shifted="ฮ">ฮ</button>
                  </div>
                  
                  <div class="keyboard-row">
                      <div class="key space-bar"> </div>
                  </div>
            </div>
        </div>

        <script src="script.js"></script>
    `;
  
    document.body.appendChild(keyboardContainer);
  });