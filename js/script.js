const clickableEl = document.querySelector(".clickable-element");
const scoreEl = document.querySelector(".score");
const upgradesListEl = document.querySelector(".upgrades");
const clicksPerClickDisplayEl = document.querySelector(".clicks-per-click");
const maxClicksPerSecondDisplayEl = document.querySelector(
  ".max-clicks-per-second"
);
const progressSaveBtn = document.getElementById("save-btn");
const progressRemoveBtn = document.getElementById("remove-btn"); 

const totalLevelsEl = document.querySelector(".total-levels")
const levelGoal = document.querySelector(".level-goal")


let currentScore = localStorage.getItem("score")
  ? Number(localStorage.getItem("score"))
  : 0;
let clicksPerClick = localStorage.getItem("cpc")
  ? Number(localStorage.getItem("cpc"))
  : 1;
let maxClicksPerSecond = localStorage.getItem("maxcps")
  ? Number(localStorage.getItem("maxcps"))
  : 2;
clicksPerClickDisplayEl.textContent = clicksPerClick;
maxClicksPerSecondDisplayEl.textContent = maxClicksPerSecond;
scoreEl.textContent = `Your $: ${currentScore}`;
upgradesListEl.innerHTML = localStorage.getItem("upgrades")
  ? localStorage.getItem("upgrades")
  : ` <li class="upgrade-item" data-updatenumber="1"
data-cost="25"
data-level="0">
  <h2 class="text">+1$ per click</h2>
  <div
    class="update-cost"
    
  >
    25 $
  </div>
  <p class="level-display">Level 0</p>
</li>
<li class="upgrade-item" data-updatenumber="2"
data-cost="25"
data-level="0">
  <h2 class="text">+0.1 max clicks per second</h2>
  <div
    class="update-cost"
    
  >
    25 $
  </div>
  <p class="level-display">Level 0</p>
</li>

<li class="upgrade-item" data-updatenumber="3"
data-cost="250"
data-level="0">
  <h2 class="text">+5$ per click</h2>
  <div
    class="update-cost"
    
  >
    250 $
  </div>
  <p class="level-display">Level 0</p>
</li>
<li class="upgrade-item" data-cost="250"
data-updatenumber="4"
data-level="0">
  <h2 class="text">+0.5 max clicks per second</h2>
  <div
    class="update-cost"
    
  >
    250 $
  </div>
  <p class="level-display">Level 0</p>
</li>`;
totalLevelsEl.textContent = `Total levels: ${getTotalLevels()}`
setPizzaSkin(getTotalLevels())
clickableEl.addEventListener(
  "click",
  _.throttle((event) => {
    currentScore += clicksPerClick;
    scoreEl.textContent = `Your $: ${currentScore}`;
    // todo animation
    // event.currentTarget.classList.add("animate");
  }, 1000 / maxClicksPerSecond)
);

function getTotalLevels(){
  let total = 0; 
  for(const element of upgradesListEl.children){
    total += Number(element.dataset.level)
  }
  return total
}

function setPizzaSkin(totalLevels){
  if(totalLevels >= 10 && totalLevels < 25){
    clickableEl.style.backgroundImage = `url(./img/pizza-lvls/pizza-lvl2.svg)`
    levelGoal.textContent = `Next pizza upgrade on level 25`
  }else if(totalLevels >=25 && totalLevels < 50){
    clickableEl.style.backgroundImage = `url(./img/pizza-lvls/pizza-lvl3.svg)`
    levelGoal.textContent = `Next pizza upgrade on level 50`
  }else if(totalLevels >= 50 && totalLevels < 150){
    clickableEl.style.backgroundImage = `url(./img/pizza-lvls/pizza-lvl4.svg)`
    levelGoal.textContent = `Next pizza upgrade on level 150`

  }else if(totalLevels >= 150){
    clickableEl.style.backgroundImage = `url(./img/pizza-lvls/pizza-lvl5.svg)`
    levelGoal.textContent = `Your pizza is perfect`
  }
}

progressSaveBtn.addEventListener("click", () => {
  localStorage.setItem("score", currentScore);
  localStorage.setItem("cpc", clicksPerClick);
  localStorage.setItem("maxcps", maxClicksPerSecond);
  localStorage.setItem("upgrades", upgradesListEl.innerHTML);
});
progressRemoveBtn.addEventListener("click", () =>{
  localStorage.removeItem("score")
  localStorage.removeItem("cpc")
  localStorage.removeItem("maxcps")
  localStorage.removeItem("upgrades")
})
// todo animation
// clickableEl.addEventListener("animationend", (event) => {
//   event.currentTarget.classList.remove("animate");
// });

upgradesListEl.addEventListener("click", (event) => {
  const currentClickedElement = event.target;
  if (currentClickedElement.nodeName === "LI") {
    const updateCost = currentClickedElement.dataset.cost;
    if (currentScore >= Number(updateCost)) {
      const currentCallback = getUpdateCallback(currentClickedElement);
      currentCallback(currentClickedElement, updateCost);
    }
  } else {
    if (
      currentClickedElement.nodeName === "DIV" ||
      currentClickedElement.nodeName === "H2" ||
      currentClickedElement.nodeName === "P"
    ) {
      const clickedEl = currentClickedElement.closest("li");
      const updateCost = clickedEl.dataset.cost;
      if (currentScore >= Number(updateCost)) {
        const currentCallback = getUpdateCallback(clickedEl);
        currentCallback(clickedEl, updateCost);
      }
    }
  }
  setPizzaSkin(getTotalLevels())
  totalLevelsEl.textContent = `Total levels: ${getTotalLevels()}`
});

function getUpdateCallback(element) {
  switch (element.dataset.updatenumber) {
    case "1": {
      return (element, cost) => {
        clicksPerClick += 1;
        currentScore -= cost;
        console.log("update");
        const currentCostDisplay = element.querySelector(".update-cost");
        element.dataset.cost = Math.ceil(cost * 0.11) * 10;
        currentCostDisplay.textContent = `${element.dataset.cost} $`;
        element.dataset.level = Number(element.dataset.level) + 1;
        currentCostDisplay.nextElementSibling.textContent = `Level ${element.dataset.level}`;
        scoreEl.textContent = `Your $: ${currentScore}`;
        clicksPerClickDisplayEl.textContent = `${clicksPerClick}`;
      };
      break;
    }
    case "2": {
      return (element, cost) => {
        maxClicksPerSecond = (parseFloat(maxClicksPerSecond) + 0.1).toFixed(1);
        currentScore -= cost;
        const currentCostDisplay = element.querySelector(".update-cost");
        element.dataset.cost = Math.ceil(cost * 1.05);
        currentCostDisplay.textContent = `${element.dataset.cost} $`;
        element.dataset.level = Number(element.dataset.level) + 1;
        currentCostDisplay.nextElementSibling.textContent = `Level ${element.dataset.level}`;
        scoreEl.textContent = `Your $: ${currentScore}`;
        maxClicksPerSecondDisplayEl.textContent = `${maxClicksPerSecond}`;
      };
    }
    case "3": {
      return (element, cost) => {
        clicksPerClick += 5;
        currentScore -= cost;
        const currentCostDisplay = element.querySelector(".update-cost");
        element.dataset.cost = Math.ceil(cost * 0.11) * 10;
        currentCostDisplay.textContent = `${element.dataset.cost} $`;
        element.dataset.level = Number(element.dataset.level) + 1;
        currentCostDisplay.nextElementSibling.textContent = `Level ${element.dataset.level}`;
        scoreEl.textContent = `Your $: ${currentScore}`;
        clicksPerClickDisplayEl.textContent = `${clicksPerClick}`;
      };
      break;
    }
    case "4": {
      return (element, cost) => {
        maxClicksPerSecond = (parseFloat(maxClicksPerSecond) + 0.5).toFixed(1);
        currentScore -= cost;
        const currentCostDisplay = element.querySelector(".update-cost");
        element.dataset.cost = Math.ceil(cost * 1.05);
        currentCostDisplay.textContent = `${element.dataset.cost} $`;
        element.dataset.level = Number(element.dataset.level) + 1;
        currentCostDisplay.nextElementSibling.textContent = `Level ${element.dataset.level}`;
        scoreEl.textContent = `Your $: ${currentScore}`;
        maxClicksPerSecondDisplayEl.textContent = `${maxClicksPerSecond}`;
      };
      break;
    }
    default: {
      return () => {
        console.log("no");
      };
    }
  }
}

/*
  Гра піцца клікер 
  прокачуючи швидкість кліку прокачується піцца
*/
