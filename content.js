let killCount = 0;
let missedCount = 0;
let spiderTypesKilled = {
  spider1: 0, // Correct syntax
  spider2: 0  // Correct syntax
};

// Function to create a spider
function createSpider() {
  const spider = document.createElement("img");

  // Randomly pick spider1 or spider2
  const randomSpider = `spider${Math.floor(Math.random() * 2) + 1}`;
  const spiderImagePath = chrome.runtime.getURL(`spiders/${randomSpider}.png`);

  // Set image source
  spider.src = spiderImagePath;
  spider.onerror = () => console.error("Failed to load spider image:", spiderImagePath);

  spider.classList.add("spider");

  // Ensure the spider is positioned absolutely
  spider.style.position = "absolute";

  // Randomize position on the screen (width and height of the viewport)
  const screenWidth = window.innerWidth - 100; // Subtracting some width for boundary
  const screenHeight = window.innerHeight - 100; // Subtracting some height for boundary
  spider.style.left = Math.random() * screenWidth + "px";
  spider.style.top = Math.random() * screenHeight + "px";

  // Set the spider size to a reasonable value
  spider.style.width = "50px";
  spider.style.height = "50px";

  // Log when a spider is created
  console.log("Spider created!", spiderImagePath);

  // Ensure the click event is bound correctly
  spider.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("Spider squashed!");
    killSpider(spider, randomSpider); // Pass the spider type to track
  });

  document.body.appendChild(spider);

  // If spider is not clicked within 5 seconds, it is "missed"
  setTimeout(() => {
    if (document.body.contains(spider)) {
      console.log("Spider removed after 5 seconds (missed)");
      missedSpider(spider);
    }
  }, 5000);
}

// Function to handle spider killing
function killSpider(spider, spiderType) {
  spider.remove(); // Remove the spider from the DOM
  killCount++; // Increment the kill count
  spiderTypesKilled[spiderType]++; // Track the type of spider killed

  console.log(`Kill count is now: ${killCount}`);

  // Save the updated kill count to Chrome storage
  chrome.storage.sync.set({
    spiderKills: killCount,
    spiderTypesKilled: spiderTypesKilled
  }, () => {
    console.log(`Spider killed! Total kills saved: ${killCount}`);
  });
}

// Function to handle missed spiders
function missedSpider(spider) {
  spider.remove();
  missedCount++; // Increment missed spider count

  chrome.storage.sync.set({
    missedSpiders: missedCount
  }, () => {
    console.log(`Spider missed! Total missed: ${missedCount}`);
  });
}

// Function to spawn spiders at random intervals
function startSpawningSpiders() {
  setInterval(() => {
    createSpider();
  }, Math.random() * 5000 + 2000); // Spiders appear between 2 and 7 seconds
}

// Retrieve the kill count and missed spiders from storage when the page loads
chrome.storage.sync.get(["spiderKills", "missedSpiders", "spiderTypesKilled"], (result) => {
  killCount = result.spiderKills || 0;
  missedCount = result.missedSpiders || 0;
  spiderTypesKilled = result.spiderTypesKilled || { spider1: 0, spider2: 0 };

  console.log(`Total spider kills from storage: ${killCount}`);
  console.log(`Total missed spiders from storage: ${missedCount}`);
});

// Start spawning spiders
startSpawningSpiders();
