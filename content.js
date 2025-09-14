
// Run this in chrome console on discord

(() => {
  if (window.__randomSenderInjected) return;
  window.__randomSenderInjected = true;

  let timeoutId = null;
  let running = false;
  let nextSendTimestamp = 0;

  // --- Send random number function ---
  const sendRandomNumber = () => {
    const randomNum = Math.floor(Math.random() * 10000) + 1;
    const inputBox = document.querySelector('[contenteditable="true"][data-slate-editor="true"]');
    if (!inputBox) return;

    inputBox.focus();

    const insertEvent = new InputEvent("beforeinput", {
      inputType: "insertText",
      data: String(randomNum),
      bubbles: true,
      cancelable: true
    });
    inputBox.dispatchEvent(insertEvent);

    const enter = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true
    });
    inputBox.dispatchEvent(enter);

    scheduleNext();
  };

  // --- Schedule next random send ---
  const scheduleNext = () => {
    if (!running) return;
    const delay = 8000 + Math.random() * 2000; // 8-10 sec
    nextSendTimestamp = Date.now() + delay;
    timeoutId = setTimeout(sendRandomNumber, delay);
  };

  // --- Start/Pause/Stop ---
  const startSending = () => {
    if (running) return;
    running = true;
    statusIndicator.textContent = "▶ Playing";
    scheduleNext();
  };

  const pauseSending = () => {
    running = false;
    clearTimeout(timeoutId);
    statusIndicator.textContent = "⏸ Paused";
  };

  const stopSending = () => {
    running = false;
    clearTimeout(timeoutId);
    popup.remove();
    window.__randomSenderInjected = false;
  };

  // --- Countdown updater ---
  const updateCountdown = () => {
    if (running) {
      const remaining = Math.max(0, nextSendTimestamp - Date.now());
      countdown.textContent = `Next in: ${(remaining / 1000).toFixed(1)}s`;
    } else {
      countdown.textContent = "Next in: --s";
    }
    requestAnimationFrame(updateCountdown);
  };

  // --- Popup UI ---
  const popup = document.createElement("div");
  Object.assign(popup.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    backgroundColor: "#1e1f23",
    color: "#fff",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
    zIndex: 999999,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
    minWidth: "160px"
  });

  const controls = document.createElement("div");
  Object.assign(controls.style, {
    display: "flex",
    gap: "6px",
    justifyContent: "space-between"
  });

  const startBtn = document.createElement("button");
  startBtn.textContent = "▶ Start";
  Object.assign(startBtn.style, {
    flex: "1",
    padding: "4px 6px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer"
  });
  startBtn.onclick = startSending;

  const pauseBtn = document.createElement("button");
  pauseBtn.textContent = "⏸ Pause";
  Object.assign(pauseBtn.style, {
    flex: "1",
    padding: "4px 6px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#f0ad4e",
    color: "#fff",
    cursor: "pointer"
  });
  pauseBtn.onclick = pauseSending;

  const stopBtn = document.createElement("button");
  stopBtn.textContent = "✕ Stop";
  Object.assign(stopBtn.style, {
    flex: "1",
    padding: "4px 6px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#d9534f",
    color: "#fff",
    cursor: "pointer"
  });
  stopBtn.onclick = stopSending;

  controls.appendChild(startBtn);
  controls.appendChild(pauseBtn);
  controls.appendChild(stopBtn);

  const statusIndicator = document.createElement("div");
  statusIndicator.textContent = "⏸ Paused";
  Object.assign(statusIndicator.style, {
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#333",
    padding: "2px 4px",
    borderRadius: "4px"
  });

  const countdown = document.createElement("div");
  countdown.textContent = "Next in: --s";
  Object.assign(countdown.style, {
    fontSize: "11px",
    textAlign: "center",
    color: "#ccc"
  });

  popup.appendChild(controls);
  popup.appendChild(statusIndicator);
  popup.appendChild(countdown);
  document.body.appendChild(popup);

  updateCountdown();
})();
