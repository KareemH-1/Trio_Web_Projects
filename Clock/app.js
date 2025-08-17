let current = document.getElementById("clock");
const openClock = () => {
  clockContainer = document.getElementById("clock");
  clockContainer.classList.remove("hide");
  if (current != clockContainer) {
    current.classList.add("hide");
    current = clockContainer;
  }
};

const openTimer = () => {
  timerContainer = document.getElementById("timer");
  timerContainer.classList.remove("hide");
  current.classList.add("hide");
  current = timerContainer;
};

const openStopWatch = () => {
  stopWatchContainer = document.getElementById("stopwatch");
  stopWatchContainer.classList.remove("hide");
  current.classList.add("hide");
  current = stopWatchContainer;
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

const changeDate = () => {
  const date = document.getElementById("dateHeading");
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
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
    if (h < 10) h = "0" + h;
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
