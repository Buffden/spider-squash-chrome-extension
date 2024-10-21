let killCount = 0;
let missedCount = 0;
let spiderTypesKilled = {
  spider1: 0,
  spider2: 0,
};

let spawnIntervalId;

function createSpider() {
  const spider = document.createElement("img");

  const randomSpider = `spider${Math.floor(Math.random() * 2) + 1}`;
  const spiderImagePath = chrome.runtime.getURL(`spiders/${randomSpider}.png`);

  spider.src = spiderImagePath;
  spider.onerror = () =>
    console.error("Failed to load spider image:", spiderImagePath);

  spider.classList.add("spider");

  spider.style.position = "absolute";

  const screenWidth = window.innerWidth - 100;
  const screenHeight = window.innerHeight - 100;
  spider.style.left = Math.random() * screenWidth + "px";
  spider.style.top = Math.random() * screenHeight + "px";

  spider.style.width = "50px";
  spider.style.height = "50px";

  console.log("Spider created!", spiderImagePath);

  spider.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("Spider squashed!");
    killSpider(spider, randomSpider);
  });

  document.body.appendChild(spider);

  setTimeout(() => {
    if (document.body.contains(spider)) {
      console.log("Spider removed after 5 seconds (missed)");
      missedSpider(spider);
    }
  }, 5000);
}

function killSpider(spider, spiderType) {
  spider.remove();
  killCount++;
  spiderTypesKilled[spiderType]++;

  console.log(`Kill count is now: ${killCount}`);

  chrome.storage.sync.set(
    {
      spiderKills: killCount,
      spiderTypesKilled: spiderTypesKilled,
    },
    () => {
      console.log(`Spider killed! Total kills saved: ${killCount}`);
    }
  );
}

function missedSpider(spider) {
  spider.remove();
  missedCount++;

  chrome.storage.sync.set(
    {
      missedSpiders: missedCount,
    },
    () => {
      console.log(`Spider missed! Total missed: ${missedCount}`);
    }
  );
}

function startSpawningSpiders() {
  if (spawnIntervalId) {
    clearInterval(spawnIntervalId);
  }

  chrome.storage.sync.get("spidersEnabled", (result) => {
    const spidersEnabled = result.spidersEnabled !== false;
    console.log(`Spider spawning ${spidersEnabled ? "enabled" : "disabled"}`);

    if (spidersEnabled) {
      spawnIntervalId = setInterval(() => {
        createSpider();
      }, Math.random() * 5000 + 2000);
    } else {
      console.log("Spider spawning is disabled.");
    }
  });
}

function stopSpawningSpiders() {
  if (spawnIntervalId) {
    clearInterval(spawnIntervalId);
    console.log("Spider spawning stopped.");
  }
}

chrome.storage.sync.get(
  ["spiderKills", "missedSpiders", "spiderTypesKilled"],
  (result) => {
    killCount = result.spiderKills || 0;
    missedCount = result.missedSpiders || 0;
    spiderTypesKilled = result.spiderTypesKilled || { spider1: 0, spider2: 0 };

    console.log(`Total spider kills from storage: ${killCount}`);
    console.log(`Total missed spiders from storage: ${missedCount}`);
  }
);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.spidersEnabled) {
    if (changes.spidersEnabled.newValue === false) {
      stopSpawningSpiders();
    } else {
      startSpawningSpiders();
    }
  }
});

startSpawningSpiders();
