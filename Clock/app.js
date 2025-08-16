let current = document.getElementById("clock");
openClock = () => {
  clockContainer = document.getElementById("clock");
  clockContainer.classList.remove("hide");
  if (current != clockContainer) {
    current.classList.add("hide");
    current = clockContainer;
  }
};

openTimer = () => {
  timerContainer = document.getElementById("timer");
  timerContainer.classList.remove("hide");
  current.classList.add("hide");
  current = timerContainer;
};

openStopWatch = () => {
  stopWatchContainer = document.getElementById("stopwatch");
  stopWatchContainer.classList.remove("hide");
  current.classList.add("hide");
  current = stopWatchContainer;
};

//StopWatch
let timeSW = 0;
let paused = false;
let stopwatchInterval = null;

startStopWatch = () => {
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

pauseStopWatch = () => {
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

resetStopWatch = () => {
  let btn = document.getElementById("SwStart");
  btn.innerHTML = "Start";
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  paused = false;
  timeSW = 0;
  displaySW(timeSW);
};

displaySW = (time) => {
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
