let current = document.getElementById("clock");
const openClock = () => {
  const clockContainer = document.getElementById("clock");
  if (current && current !== clockContainer) current.classList.add("hide");
  clockContainer.classList.remove("hide");
  current = clockContainer;
  localStorage.setItem("currentPage", "clock");
};

const openTimer = () => {
  const timerContainer = document.getElementById("timer");
  if (current && current !== timerContainer) current.classList.add("hide");
  timerContainer.classList.remove("hide");
  current = timerContainer;
  localStorage.setItem("currentPage", "timer");
};

const openStopWatch = () => {
  const stopWatchContainer = document.getElementById("stopwatch");
  if (current && current !== stopWatchContainer) current.classList.add("hide");
  stopWatchContainer.classList.remove("hide");
  current = stopWatchContainer;
  localStorage.setItem("currentPage", "stopwatch");
};

//StopWatch
let timeSW = 0;
let paused = false;
let stopwatchInterval = null;

const startStopWatch = () => {
  let btn = document.getElementById("SwStart");
  btn.innerHTML = "Pause";
  if (!stopwatchInterval) {
    stopwatchInterval = setInterval(() => {
      timeSW++;
      displaySW(timeSW);
    }, 1000);
  }
  displaySW(timeSW);
};

document.getElementById("SwStart").addEventListener("click", function () {
  if (stopwatchInterval && timeSW > 0) {
    pauseStopWatch();
  } else {
    startStopWatch();
  }
});

const pauseStopWatch = () => {
  if (timeSW) {
    let btn = document.getElementById("SwStart");
    paused = !paused;
    paused ? (btn.innerHTML = "Continue") : (btn.innerHTML = "Pause");
    if (paused) {
      if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
      }
    } else {
      paused = false;
      startStopWatch();
    }
  }
};

const resetStopWatch = () => {
  let btn = document.getElementById("SwStart");
  btn.innerHTML = "Start";
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  paused = false;
  timeSW = 0;
  displaySW(timeSW);
};

const displaySW = (time) => {
  let timeStopWatch = document.getElementById("timeStopWatch");
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = time % 60;

  let hoursStr = hours >= 10 ? hours.toString() : `0${hours.toString()}`;
  let minutesStr =
    minutes >= 10 ? minutes.toString() : `0${minutes.toString()}`;
  let secondsStr =
    seconds >= 10 ? seconds.toString() : `0${seconds.toString()}`;

  timeStopWatch.textContent = `${hoursStr} : ${minutesStr} : ${secondsStr}`;
};
//---------------------------

// CLOCK
const d = new Date();
let day = d.getDate();
let month = d.getMonth() + 1;
let year = d.getFullYear();
const changeDate = () => {
  const date = document.getElementById("dateHeading");
  day = d.getDate();
  month = d.getMonth() + 1;
  year = d.getFullYear();
  date.innerHTML = `${month} / ${day} / ${year}`;
};

//time
let currentT = "ampm";

window.onload = function () {

  const savedFormat = localStorage.getItem("timeFormat");
  const btn = document.getElementById("changeampm");
  if (savedFormat) {
    currentT = savedFormat;
    if (savedFormat == "24h") {
      btn.innerHTML = "Change to AM/PM format";
    } else {
      btn.innerHTML = "Change to 24H format";
    }
  } else {
    currentT = "ampm";
  }
  updateTimeDisplay();
  changeDay();
  changeDate();

  const timerForm = document.getElementById("timerForm");
  if (timerForm) timerForm.onsubmit = handleTimerSubmit;
  const resetBtn = document.getElementById("resetTimer");
  if (resetBtn) resetBtn.onclick = resetTimer;
  const stopBtn = document.getElementById("stopTimer");
  if (stopBtn) stopBtn.onclick = stopTimer;
  const pauseBtn = document.getElementById("pauseTimer");
  if (pauseBtn) pauseBtn.onclick = pauseTimer;
  showPauseButton(false);
  showResetStopButtons(false);

  // Load last opened page
  const lastPage = localStorage.getItem("currentPage");
  if (lastPage === "timer") {
    openTimer();
  } else if (lastPage === "stopwatch") {
    openStopWatch();
  } else {
    openClock();
  }
};

const timeElement = document.getElementById("time");

function updateTimeDisplay() {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  if (currentT === "ampm") {
    let ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    if (m < 10) m = "0" + m;
    timeElement.textContent = `${h}:${m} ${ampm}`;
  } else {
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    timeElement.textContent = `${h}:${m}`;
  }
}

// time ampm
let toggle24H = () => {
  const btn = document.getElementById("changeampm");
  currentT = currentT === "ampm" ? "24h" : "ampm";
  if (currentT == "24h") {
    btn.innerHTML = "Change to AM/PM format";
  } else {
    btn.innerHTML = "Change to 24H format";
  }
  localStorage.setItem("timeFormat", currentT);
  updateTimeDisplay();
};

setInterval(updateTimeDisplay, 1000);

let changeDay = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = daysOfWeek[d.getDay()];
  const currentDayElement = document.getElementById(currentDay);

  currentDayElement.classList.add("current");
  currentDayElement.classList.remove("transparent");
};

setInterval(() => {
  const now = new Date();
  const currentDay = now.getDate();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  if (currentDay !== day || (currentHours === 0 && currentMinutes === 0)) {
    day = currentDay;
    changeDay();
    changeDate();
  }
}, 1000);

// Timer


let timerInterval = null;
let timerRemaining = 0;
let timerPaused = false;
let timerTickAudio = null;
let timerPrevValue = 0;


function handleTimerSubmit(event) {
  event.preventDefault();
  let timerH = document.getElementById("timerHours");
  let timerM = document.getElementById("timerMinutes");
  let timerS = document.getElementById("timerSeconds");
  if (
    timerH != null && timerH.value >= 0 &&
    timerM != null && timerM.value >= 0 &&
    timerS != null && timerS.value >= 0
  ) {
    let remaining = Number(timerH.value) * 3600 + Number(timerM.value) * 60 + Number(timerS.value);
    if (remaining === 0) {
      document.getElementById("timerTime").textContent = "Try entering positive numbers";
      return;
    }
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    stopTimerTick();
    timerRemaining = remaining;
    timerPrevValue = remaining;
    timerPaused = false;
    updateTimerDisplay();
    startTimerTick();
    const timerStatus = document.getElementById("timerStatus");
    if (timerStatus) timerStatus.classList.remove("hideTimer");
    showPauseButton(true);
    showResetStopButtons(false);
    timerInterval = setInterval(() => {
      if (!timerPaused) {
        timerRemaining--;
        updateTimerDisplay();
        if (timerRemaining <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          stopTimerTick();
          document.getElementById("timerTime").textContent = "Time's up!";
          playTimerDoneUntilStopped();
          showPauseButton(false);
          showResetStopButtons(true);
        }
      }
    }, 1000);
  } else {
    document.getElementById("timerTime").textContent = "Please enter valid values!";
  }
}

function updateTimerDisplay() {
  let timerTime = document.getElementById("timerTime");
  let remaining = timerRemaining;
  let hours = Math.floor(remaining / 3600);
  let minutes = Math.floor((remaining % 3600) / 60);
  let seconds = remaining % 60;
  let hoursStr = hours < 10 ? "0" + hours : hours;
  let minutesStr = minutes < 10 ? "0" + minutes : minutes;
  let secondsStr = seconds < 10 ? "0" + seconds : seconds;
  timerTime.textContent = `${hoursStr} : ${minutesStr} : ${secondsStr}`;
}


function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  stopTimerTick();
  timerPaused = false;
  const timerStatus = document.getElementById("timerStatus");
  if (timerStatus) timerStatus.classList.add("hideTimer");
  showPauseButton(false);
  showResetStopButtons(false);
  const pauseBtn = document.getElementById("pauseTimer");
  if (pauseBtn) pauseBtn.textContent = "Pause";
  if (timerDoneAudio) {
    timerDoneAudio.pause();
    timerDoneAudio.currentTime = 0;
  }
}


function pauseTimer() {
  timerPaused = !timerPaused;
  const pauseBtn = document.getElementById("pauseTimer");
  const resetBtn = document.getElementById("resetTimer");
  const stopBtn = document.getElementById("stopTimer");
  if (timerPaused) {
    pauseBtn.textContent = "Resume";
    stopTimerTick();
    if (resetBtn) resetBtn.style.display = "none";
    if (stopBtn) stopBtn.style.display = "inline-block";
  } else {
    pauseBtn.textContent = "Pause";
    startTimerTick();
    showResetStopButtons(false);
  }
}

function startTimerTick() {
  if (!timerTickAudio) {
    timerTickAudio = new Audio('./assets/timerTick.mp3');
    timerTickAudio.loop = true;
  }
  timerTickAudio.currentTime = 0;
  timerTickAudio.play();
}

function stopTimerTick() {
  if (timerTickAudio) {
    timerTickAudio.pause();
    timerTickAudio.currentTime = 0;
  }
}

function showPauseButton(show) {
  const pauseBtn = document.getElementById("pauseTimer");
  if (pauseBtn) pauseBtn.style.display = show ? "inline-block" : "none";
}

function showResetStopButtons(show) {
  const resetBtn = document.getElementById("resetTimer");
  const stopBtn = document.getElementById("stopTimer");
  if (resetBtn) resetBtn.style.display = show ? "inline-block" : "none";
  if (stopBtn) stopBtn.style.display = show ? "inline-block" : "none";
}


let timerDoneAudio = null;

function playTimerDoneUntilStopped() {
  if (timerDoneAudio && !timerDoneAudio.paused) return;

  timerDoneAudio = new Audio('./assets/timerDone.mp3');
  timerDoneAudio.loop = true;
  timerDoneAudio.play();

  function stopAudio() {
    if (timerDoneAudio) {
      timerDoneAudio.pause();
      timerDoneAudio.currentTime = 0;
    }
    var stopBtn = document.getElementById("stopTimer");
    var resetBtn = document.getElementById("resetTimer");
    if (stopBtn) stopBtn.removeEventListener("click", stopAudio);
    if (resetBtn) resetBtn.removeEventListener("click", stopAudio);
  }

  var stopBtn = document.getElementById("stopTimer");
  var resetBtn = document.getElementById("resetTimer");
  if (stopBtn) {
    stopBtn.removeEventListener("click", stopAudio);
    stopBtn.addEventListener("click", stopAudio);
  }
  if (resetBtn) {
    resetBtn.removeEventListener("click", stopAudio);
    resetBtn.addEventListener("click", stopAudio);
  }
}


