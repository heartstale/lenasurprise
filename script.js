
const OPEN_DATE_MSK = new Date("2026-06-23T00:00:00+03:00");

const lock = document.getElementById("lock");
const site = document.getElementById("site");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const blocks = {
  days: daysEl.closest(".time-block"),
  hours: hoursEl.closest(".time-block"),
  minutes: minutesEl.closest(".time-block"),
  seconds: secondsEl.closest(".time-block"),
};

let prev = { days: null, hours: null, minutes: null, seconds: null };

function pad2(n){ return String(n).padStart(2, "0"); }

function ping(key){
  const b = blocks[key];
  if(!b) return;

  b.classList.remove("pulse");
  void b.offsetWidth;
  b.classList.add("pulse");

  const num = b.querySelector("span");
  if(num){
    num.classList.remove("flip");
    void num.offsetWidth;
    num.classList.add("flip");
  }
}

function setValue(el, key, nextVal){
  const nextText = key === "days" ? String(nextVal).padStart(2, "0") : pad2(nextVal);
  if(prev[key] === nextText) return;

  prev[key] = nextText;
  el.textContent = nextText;
  ping(key);
}

function updateTimer(){
  const now = new Date();
  const diff = OPEN_DATE_MSK - now;

  if(diff <= 0){
    lock.classList.add("fade-out");
    setTimeout(()=>{
      lock.style.display = "none";
      site.hidden = false;
    }, 560);
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  setValue(daysEl, "days", days);
  setValue(hoursEl, "hours", hours);
  setValue(minutesEl, "minutes", minutes);
  setValue(secondsEl, "seconds", seconds);
}

updateTimer();
setInterval(updateTimer, 1000);


const card = document.querySelector(".lock-card");

function setTilt(x, y){
  const rX = (y - 0.5) * -6;
  const rY = (x - 0.5) * 6;
  card.style.transform = `translateY(-2px) rotateX(${rX}deg) rotateY(${rY}deg)`;
}

if (card && window.matchMedia("(hover:hover)").matches){
  window.addEventListener("mousemove", (e)=>{
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    setTilt(x, y);
  });

  window.addEventListener("mouseleave", ()=>{
    card.style.transform = "";
  });
}
