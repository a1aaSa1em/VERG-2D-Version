/**
 *  @file    sketch.js
 *  @author  Corey Ford
 *  @date    March 2025
 *  @version 1.0
 *
 *  @section DESCRIPTION
 *
 *  P5js sketch entry point.
 *
 */
'use strict';

let messageHandler;

/**
<<<<<<< Updated upstream
 * Initializes the canvas and the message handler.
=======
 * @file    sketch.js
 * @author  Corey Ford
 * @date    June 2025 (Updated)
 * @version 1.17 (Escape Room Game - Robust Movement & Blocking)
 * @section DESCRIPTION
 * P5js sketch entry point (2D Escape Room Game with sequential room puzzles and strict door blocking).
>>>>>>> Stashed changes
 */
window.setup = function() {
  createCanvas(620, 420);
  messageHandler = new MessageHandler();
  messageHandler.sendMessageToMQTT('middle', 'bathroom', 'led', 0, 'your own information message here');
};

<<<<<<< Updated upstream
/**
 * Determines the fill color based on the room's LED status.
 * @param {string} room The room name (e.g., 'bathroom', 'bedroom').
 */
function getLEDForRoom(room) {
  const msg = messageHandler.getMostRecentValueForComponent('led', room);
  fill(msg ? 'yellow' : 'navy');
}

/**
 * Continuously draws shapes and updates the display.
 */
window.draw = function() {
  background(200);
  strokeWeight(5);
  stroke('brown');

  const rooms = [
    { name: 'bathroom', x: 10, y: 10, w: 200, h: 150 },
    { name: 'bedroom', x: 10, y: 110, w: 200, h: 250 },
    { name: 'living', x: 210, y: 10, w: 400, h: 350 },
    { name: 'front', x: 210, y: 360, w: 400, h: 50 },
  ];

  rooms.forEach(({ name, x, y, w, h }) => {
    getLEDForRoom(name);
    rect(x, y, w, h);
  });
};
=======
// === GLOBALS ===
let defaultFont;

// IoT Device States
let ledBrightness = 0;
let ledOn = false;
let fanOn = false;
let fanAngle = 0;

// PIR/Motion Sensor variables
let lastPirValue = 0;
let lastMotionTime = 0;
const MOTION_TIMEOUT = 10000;

let roomTemp = 0;
let showTemp = true;

let messageHandler = new MessageHandler();

// Character variables
let charX;
let charY;
let charSize = 20;
let charSpeed = 3;

// Room dimensions
const TOP_ROOM_HEIGHT = 200;
const BATHROOM_WIDTH = 200;
const BATHROOM_HEIGHT = TOP_ROOM_HEIGHT;
const BEDROOM_WIDTH = 300;
const BEDROOM_HEIGHT = TOP_ROOM_HEIGHT;
const LIVING_ROOM_WIDTH = BEDROOM_WIDTH + BATHROOM_WIDTH;
const LIVING_ROOM_HEIGHT = 350;
const TOTAL_HOUSE_WIDTH = LIVING_ROOM_WIDTH;
const TOTAL_HOUSE_HEIGHT = TOP_ROOM_HEIGHT + LIVING_ROOM_HEIGHT;

// === Doorway Definitions ===
const DOOR_WIDTH = 30;
const DOOR_HEIGHT = 30;
const ROOM_BORDER_THICKNESS = 2;

const DOOR_PROXIMITY_BUFFER = 70; // For visual feedback only

var houseTopLeftX = 0;
var houseTopLeftY = 0;

let doorBathroomBedroom = { x: BEDROOM_WIDTH, y: TOP_ROOM_HEIGHT / 2, width: ROOM_BORDER_THICKNESS + 2, height: DOOR_HEIGHT, id: 'bathToBed' };
let bedroomToLivingRoomDoor = { x: BEDROOM_WIDTH / 2, y: BEDROOM_HEIGHT - ROOM_BORDER_THICKNESS / 2, width: DOOR_WIDTH, height: ROOM_BORDER_THICKNESS + 2, id: 'bedToLiving' };
let bathroomToLivingRoomDoor = { x: BEDROOM_WIDTH + BATHROOM_WIDTH / 2, y: BATHROOM_HEIGHT - ROOM_BORDER_THICKNESS / 2, width: DOOR_WIDTH, height: ROOM_BORDER_THICKNESS + 2, id: 'bathToLiving' };
let livingRoomExitDoor = { x: LIVING_ROOM_WIDTH / 2, y: LIVING_ROOM_HEIGHT - ROOM_BORDER_THICKNESS / 2, width: DOOR_WIDTH * 2, height: ROOM_BORDER_THICKNESS + 2, id: 'livingExit' };


// === Game State Variables ===
let currentRoom = 'bathroom';

// Door Unlocked Status
let bathroomToBedroomDoorUnlocked = false;
let bedroomToLivingRoomDoorUnlocked = false;
let bathroomToLivingRoomDoorUnlocked = false;
let exitDoorUnlocked = false;

// Puzzle Management States
let activePuzzle = null;
let puzzleMessage = '';
let puzzleInput = '';
let puzzleTimerStartTime = 0;
let puzzleTargetDuration = 0;
let puzzleFeedbackMessage = '';

// === In-Browser Control Buttons ===
var ledButton = { x: 20, y: 20, w: 100, h: 40, text: "Toggle LED" };
var fanButton = { x: 20, y: 70, w: 100, h: 40, text: "Toggle Fan" };

// === Debug Flag ===
const DEBUG_DRAW_DOORS = true;


function preload() {
  defaultFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  houseTopLeftX = (width / 2) - (TOTAL_HOUSE_WIDTH / 2);
  houseTopLeftY = (height / 2) - (TOTAL_HOUSE_HEIGHT / 2);
  
  charX = houseTopLeftX + BEDROOM_WIDTH + BATHROOM_WIDTH / 2;
  charY = houseTopLeftY + BATHROOM_HEIGHT / 2;

  console.log("[Setup] Game initialized. Starting room: " + currentRoom);
  console.log("[Setup] Initial char pos: (" + charX + ", " + charY + ")");
}

function drawRooms() {
  houseTopLeftX = (width / 2) - (TOTAL_HOUSE_WIDTH / 2);
  houseTopLeftY = (height / 2) - (TOTAL_HOUSE_HEIGHT / 2);

  stroke(50);
  strokeWeight(2);
  noFill();
  rect(houseTopLeftX, houseTopLeftY, TOTAL_HOUSE_WIDTH, TOTAL_HOUSE_HEIGHT);
  noStroke();

  let bedroomX = houseTopLeftX;
  let bedroomY = houseTopLeftY;
  drawBedroom(bedroomX, bedroomY, BEDROOM_WIDTH, BEDROOM_HEIGHT, ledOn, ledBrightness);

  let bathroomX = bedroomX + BEDROOM_WIDTH;
  let bathroomY = houseTopLeftY;
  drawBathroom(bathroomX, bathroomY, BATHROOM_WIDTH, BATHROOM_HEIGHT, fanOn, ledOn, ledBrightness);

  let livingRoomX = houseTopLeftX;
  let livingRoomY = houseTopLeftY + TOP_ROOM_HEIGHT;
  drawLivingRoom(livingRoomX, livingRoomY, LIVING_ROOM_WIDTH, LIVING_ROOM_HEIGHT, ledOn, ledBrightness, roomTemp, showTemp);

  stroke(50);
  strokeWeight(2);

  line(bedroomX + BEDROOM_WIDTH, bedroomY,
       bedroomX + BEDROOM_WIDTH, bedroomY + TOP_ROOM_HEIGHT);

  line(houseTopLeftX, houseTopLeftY + TOP_ROOM_HEIGHT,
       houseTopLeftX + TOTAL_HOUSE_WIDTH, houseTopLeftY + TOP_ROOM_HEIGHT);

  noStroke();
}


function draw() {
  background(30);

  let nextCharX = charX; // Calculate potential next X
  let nextCharY = charY; // Calculate potential next Y

  // 1. Calculate potential next position based on key input
  if (activePuzzle === null && currentRoom !== 'escaped') {
    if (keyIsDown(LEFT_ARROW)) { nextCharX -= charSpeed; }
    if (keyIsDown(RIGHT_ARROW)) { nextCharX += charSpeed; }
    if (keyIsDown(UP_ARROW)) { nextCharY -= charSpeed; }
    if (keyIsDown(DOWN_ARROW)) { nextCharY += charSpeed; }
  }

  // 2. Check if this potential next position is valid (within room bounds AND not inside a locked door)
  let canMove = true;

  // Check general room bounds first
  const currentRoomBounds = getRoomBounds(currentRoom);
  if (currentRoomBounds) {
      if (nextCharX < currentRoomBounds.minX + charSize / 2 || nextCharX > currentRoomBounds.maxX - charSize / 2 ||
          nextCharY < currentRoomBounds.minY + charSize / 2 || nextCharY > currentRoomBounds.maxY - charSize / 2) {
          canMove = false; // Blocked by room wall
          // console.log("[Blocking] Blocked by room wall.");
      }
  }

  // Check specific locked doors if movement is still possible to prevent clipping
  if (canMove && activePuzzle === null && currentRoom !== 'escaped') {
      // For each relevant locked door in current room:
      if (currentRoom === 'bathroom' && !bathroomToBedroomDoorUnlocked && isCharInDoor(nextCharX, nextCharY, doorBathroomBedroom)) {
          canMove = false; console.log("[Blocking] Tried to enter locked Bathroom->Bedroom door.");
      } else if (currentRoom === 'bedroom' && !bedroomToLivingRoomDoorUnlocked && isCharInDoor(nextCharX, nextCharY, bedroomToLivingRoomDoor)) {
          canMove = false; console.log("[Blocking] Tried to enter locked Bedroom->Living Room door.");
      } else if (currentRoom === 'livingRoom' && !exitDoorUnlocked && isCharInDoor(nextCharX, nextCharY, livingRoomExitDoor)) {
          canMove = false; console.log("[Blocking] Tried to enter locked Living Room Exit door.");
      }
      // Also prevent going directly from Bathroom to Living Room if Bedroom not solved
      if (currentRoom === 'bathroom' && !bedroomToLivingRoomDoorUnlocked && isCharInDoor(nextCharX, nextCharY, bathroomToLivingRoomDoor)) {
          canMove = false; console.log("[Blocking] Tried to enter locked Bathroom->Living Room (direct) door.");
      }
  }

  // 3. If movement is valid, update character position
  if (canMove) {
      charX = nextCharX;
      charY = nextCharY;
  }
  // else, character stays at current charX, charY (previous position)

  // === MQTT Integration & IoT Logic ===
  const tempValue = messageHandler.getMostRecentValueForComponent('temp', 'sensing', 'middle');
  if (!isNaN(tempValue) && tempValue !== null) { roomTemp = tempValue; } else { roomTemp = 20; }

  const fanButtonValue = messageHandler.getMostRecentValueForComponent('fan', 'bathroom', 'middle');
  if (mouseIsPressed === false && fanButtonValue !== null) { fanOn = (fanButtonValue === 1); }
  if (fanOn) { fanAngle += 0.2; } else if (fanAngle !== 0) { fanAngle = (fanAngle > 0.1 || fanAngle < -0.1) ? fanAngle * 0.9 : 0; }

  const pirValue = messageHandler.getMostRecentValueForComponent('pir', 'living', 'middle');
  const mqttLedValue = messageHandler.getMostRecentValueForComponent('led', 'living', 'middle');
  let pirIsActive = false;

  if (pirValue !== null) {
      if (pirValue === 1) { ledBrightness = 255; lastMotionTime = millis(); lastPirValue = 1; pirIsActive = true; }
      else if (pirValue === 0 && lastPirValue === 1) { lastMotionTime = millis(); lastPirValue = 0; pirIsActive = true; }
  }
  if (lastPirValue === 0 && millis() - lastMotionTime > MOTION_TIMEOUT) {
      if (ledBrightness > 0) { ledBrightness = 0; }
  }
  if (mouseIsPressed === false && !pirIsActive && mqttLedValue !== null) { ledBrightness = (mqttLedValue === 1) ? 255 : 0; }
  ledOn = (ledBrightness > 0);


  console.log(`[Draw Loop] Current Room: ${currentRoom} Char Pos: (${charX.toFixed(0)}, ${charY.toFixed(0)}) Active Puzzle: ${activePuzzle}`);

  checkRoomTransitions();

  // --- Drawing Order ---
  drawRooms();
  drawCharacter(charX, charY);

  drawButtons();
  drawPuzzleUI();

  if (DEBUG_DRAW_DOORS) {
      drawDebugDoorZones();
  }

  if (currentRoom === 'escaped') { drawEscapeScreen(); }
}


// === Helper Functions for Game Logic ===

function getRoomBounds(roomName) {
  let minX, maxX, minY, maxY;
  const hX = houseTopLeftX;
  const hY = houseTopLeftY;

  if (roomName === 'bedroom') { minX = hX; maxX = hX + BEDROOM_WIDTH; minY = hY; maxY = hY + BEDROOM_HEIGHT; }
  else if (roomName === 'bathroom') { minX = hX + BEDROOM_WIDTH; maxX = hX + BEDROOM_WIDTH + BATHROOM_WIDTH; minY = hY; maxY = hY + BATHROOM_HEIGHT; }
  else if (roomName === 'livingRoom') { minX = hX; maxX = hX + LIVING_ROOM_WIDTH; minY = hY + TOP_ROOM_HEIGHT; maxY = hY + TOP_ROOM_HEIGHT + LIVING_ROOM_HEIGHT; }
  else { return null; }
  return { minX, maxX, minY, maxY };
}

// Checks if character is within the exact door interaction zone
function isCharInDoor(charAbsX, charAbsY, doorRel) {
    const doorAbsMinX = houseTopLeftX + doorRel.x - doorRel.width / 2;
    const doorAbsMaxX = houseTopLeftX + doorRel.x + doorRel.width / 2;
    const doorAbsMinY = houseTopLeftY + doorRel.y - doorRel.height / 2;
    const doorAbsMaxY = houseTopLeftY + doorRel.y + doorRel.height / 2;

    const buffer = charSize / 2 + 5;
    const isInside = (charAbsX > doorAbsMinX - buffer && charAbsX < doorAbsMaxX + buffer &&
                      charAbsY > doorAbsMinY - buffer && charAbsY < doorAbsMaxY + buffer);
    // console.log(`[isCharInDoor] Char(${charAbsX.toFixed(0)},${charAbsY.toFixed(0)}) vs Door(${doorAbsMinX.toFixed(0)},${doorAbsMinY.toFixed(0)} - ${doorAbsMaxX.toFixed(0)},${doorAbsMaxY.toFixed(0)}) -> ${isInside} for door type: ${doorRel.id || 'N/A'}`); // Commented out for less spam
    return isInside;
}

// Checks if character is near a door (larger proximity zone)
function isCharNearDoor(charAbsX, charAbsY, doorRel) {
    const doorAbsCenterX = houseTopLeftX + doorRel.x;
    const doorAbsCenterY = houseTopLeftY + doorRel.y;
    
    const distance = dist(charAbsX, charAbsY, doorAbsCenterX, doorAbsCenterY);
    
    return distance < (DOOR_PROXIMITY_BUFFER + max(doorRel.width, doorRel.height) / 2);
}


// Manages character transitions between rooms and activates puzzles
function checkRoomTransitions() {
  const charAbsX = charX;
  const charAbsY = charY;

  const doors = { // Centralized door data
    bathToBed: {
      rel: doorBathroomBedroom, // Store relative object for easier access
      abs: { minX: houseTopLeftX + doorBathroomBedroom.x - doorBathroomBedroom.width / 2, maxX: houseTopLeftX + doorBathroomBedroom.x + doorBathroomBedroom.width / 2, minY: houseTopLeftY + doorBathroomBedroom.y - doorBathroomBedroom.height / 2, maxY: houseTopLeftY + doorBathroomBedroom.y + doorBathroomBedroom.height / 2 },
      solved: bathroomToBedroomDoorUnlocked,
      targetRoom: 'bedroom',
      puzzleType: 'bathroom_fan', puzzleMsg: "Bathroom Puzzle: Keep the Fan ON for 5-7 seconds to unlock the Bedroom door. Press 'E' to try.", puzzleSolutionDuration: 6000
    },
    bedToLiving: {
      rel: bedroomToLivingRoomDoor,
      abs: { minX: houseTopLeftX + bedroomToLivingRoomDoor.x - bedroomToLivingRoomDoor.width / 2, maxX: houseTopLeftX + bedroomToLivingRoomDoor.x + bedroomToLivingRoomDoor.width / 2, minY: houseTopLeftY + bedroomToLivingRoomDoor.y - bedroomToLivingRoomDoor.height / 2, maxY: houseTopLeftY + bedroomToLivingRoomDoor.y + bedroomToLivingRoomDoor.height / 2 },
      solved: bedroomToLivingRoomDoorUnlocked,
      targetRoom: 'livingRoom',
      puzzleType: 'bedroom_light', puzzleMsg: "Bedroom Puzzle: Turn on the LED for 3-5 seconds to unlock the Living Room door. Press 'E' to try.", puzzleSolutionDuration: 4000
    },
    livingExit: {
      rel: livingRoomExitDoor,
      abs: { minX: houseTopLeftX + livingRoomExitDoor.x - livingRoomExitDoor.width / 2, maxX: houseTopLeftX + livingRoomExitDoor.x + livingRoomExitDoor.width / 2, minY: houseTopLeftY + livingRoomExitDoor.y - livingRoomExitDoor.height / 2, maxY: houseTopLeftY + livingRoomExitDoor.y + livingRoomExitDoor.height / 2 },
      solved: exitDoorUnlocked,
      targetRoom: 'escaped',
      puzzleType: 'livingRoom_temp', puzzleMsg: "Exit Puzzle: Enter the exact house temperature. Press 'E' to enter code. Press 'ENTER' to submit.",
    }
  };

  let nearPuzzleDoor = false;
  let doorToInteractWith = null;

  if (currentRoom === 'bathroom') {
    if (isCharInDoor(charAbsX, charAbsY, doorBathroomBedroom) && !doors.bathToBed.solved) {
      nearPuzzleDoor = true; doorToInteractWith = doors.bathToBed;
      console.log("[checkRoomTransitions] Detected near Bathroom->Bedroom door. Puzzle pending.");
    }
  } else if (currentRoom === 'bedroom') {
    if (isCharInDoor(charAbsX, charAbsY, doorBathroomBedroom) && doors.bathToBed.solved) {
        currentRoom = 'bathroom'; charX = doors.bathToBed.abs.maxX + charSize/2 + 5; return;
    }
    if (isCharInDoor(charAbsX, charAbsY, bedroomToLivingRoomDoor) && !doors.bedToLiving.solved) {
      nearPuzzleDoor = true; doorToInteractWith = doors.bedToLiving;
      console.log("[checkRoomTransitions] Detected near Bedroom->LivingRoom door. Puzzle pending.");
    }
  } else if (currentRoom === 'livingRoom') {
    if (isCharInDoor(charAbsX, charAbsY, bedroomToLivingRoomDoor) && doors.bedToLiving.solved) {
        currentRoom = 'bedroom'; charY = doors.bedToLiving.abs.minY - charSize/2 - 5; return;
    }
    if (isCharInDoor(charAbsX, charAbsY, bathroomToLivingRoomDoor) && bedroomToLivingRoomDoorUnlocked) {
        currentRoom = 'bathroom'; charY = houseTopLeftY + BATHROOM_HEIGHT - bathroomToLivingRoomDoor.height/2 - charSize/2 - 5; return;
    }
    if (isCharInDoor(charAbsX, charAbsY, livingExitDoor) && !doors.livingExit.solved) {
      nearPuzzleDoor = true; doorToInteractWith = doors.livingExit;
      console.log("[checkRoomTransitions] Detected near LivingRoom->Exit door. Puzzle pending.");
    }
  }

  // Display "Press 'E' to interact" prompt (only if puzzle not active)
  if (nearPuzzleDoor && activePuzzle === null && doorToInteractWith && !doorToInteractWith.solved) {
    puzzleMessage = doorToInteractWith.puzzleMsg;
    fill(255); textSize(16); textAlign(CENTER, BOTTOM);
    text("Press 'E' to interact", charAbsX, charAbsY - charSize);
    console.log(`[checkRoomTransitions] Prompt displayed for: ${doorToInteractWith.puzzleType}`);
  } else if (activePuzzle === null && !nearPuzzleDoor) {
      if (puzzleMessage !== '') console.log("[checkRoomTransitions] Prompt cleared.");
      puzzleMessage = '';
  }

  // Handle actual room transitions for *solved* doors
  if (activePuzzle === null) {
      if (currentRoom === 'bathroom' && isCharInDoor(charAbsX, charAbsY, doorBathroomBedroom) && doors.bathToBed.solved) {
          currentRoom = 'bedroom'; charX = doors.bathToBed.abs.minX - charSize/2 - 5; return;
      }
      else if (currentRoom === 'bedroom' && isCharInDoor(charAbsX, charAbsY, bedroomToLivingRoomDoor) && doors.bedToLiving.solved) {
          currentRoom = 'livingRoom'; charY = doors.bedToLiving.abs.maxY + charSize/2 + 5; return;
      }
      else if (currentRoom === 'livingRoom' && isCharInDoor(charAbsX, charAbsY, livingExitDoor) && doors.livingExit.solved) {
          currentRoom = 'escaped'; return;
      }
  }
}

function keyPressed() {
  if (currentRoom === 'escaped') return;

  // Handle puzzle activation by number keys (anywhere in room)
  if (activePuzzle === null) {
    if (currentRoom === 'bathroom' && key === '1' && !bathroomToBedroomDoorUnlocked) {
      activatePuzzle('bathroom_fan', 6000);
    } else if (currentRoom === 'bedroom' && key === '2' && !bedroomToLivingRoomDoorUnlocked) {
      activatePuzzle('bedroom_light', 4000);
    } else if (currentRoom === 'livingRoom' && key === '3' && !exitDoorUnlocked) {
      activatePuzzle('livingRoom_temp');
    }
  } else { // If a puzzle IS active, handle specific keyboard input (e.g., password typing)
    if (activePuzzle === 'livingRoom_temp') {
      if (keyCode >= 48 && keyCode <= 57) { puzzleInput += key; } else if (key === '.') { puzzleInput += key; }
      else if (keyCode === BACKSPACE) { puzzleInput = puzzleInput.substring(0, puzzleInput.length - 1); }
      else if (keyCode === ENTER) {
        const expectedTemp = roomTemp.toFixed(1);
        if (puzzleInput === expectedTemp.toString()) {
          exitDoorUnlocked = true; puzzleFeedbackMessage = "Correct! The house is unlocked!";
          setTimeout(() => { currentRoom = 'escaped'; activePuzzle = null; }, 1500);
        } else {
          puzzleFeedbackMessage = `Incorrect. The code is ${expectedTemp}. You entered ${puzzleInput}. Try again.`; puzzleInput = '';
        }
      }
    }
  }

  // T key for temperature display toggle
  if (key === 'T' || key === 't') { showTemp = !showTemp; }
}

// Helper to activate a puzzle
function activatePuzzle(type, duration = 0) {
  activePuzzle = type;
  puzzleTimerStartTime = 0;
  puzzleTargetDuration = duration;
  puzzleInput = '';
  puzzleFeedbackMessage = '';
  puzzleMessage = getPuzzlePrompt(activePuzzle); // Set initial message
}


function getPuzzlePrompt(type) {
    if (type === 'bathroom_fan') { let durationSec = (6000 / 1000).toFixed(0); return `Bathroom Puzzle: Keep the Fan ON for exactly ${durationSec} seconds! Click anywhere to exit puzzle.`; }
    else if (type === 'bedroom_light') { let durationSec = (4000 / 1000).toFixed(0); return `Bedroom Puzzle: Turn on the LED for exactly ${durationSec} seconds! Click anywhere to exit puzzle.`; }
    else if (type === 'livingRoom_temp') { return `Exit Puzzle: Enter the exact house temperature (${roomTemp.toFixed(1)}°C) using your keyboard. Press ENTER to submit.`; }
    return "";
}

function drawPuzzleUI() {
  if (activePuzzle !== null) {
    fill(0, 0, 0, 180); rect(0, 0, width, height);
    fill(255); textSize(24); textAlign(CENTER, CENTER); text(puzzleMessage, width / 2, height / 2 - 100);
    if (activePuzzle === 'bathroom_fan' || activePuzzle === 'bedroom_light') {
      const elapsedTime = puzzleTimerStartTime > 0 ? millis() - puzzleTimerStartTime : 0;
      fill(255); textSize(20); text(`Time active: ${(elapsedTime / 1000).toFixed(1)}s / ${(puzzleTargetDuration / 1000).toFixed(1)}s`, width / 2, height / 2);
      fill(200, 0, 0);
      if (activePuzzle === 'bathroom_fan') {
        if (!fanOn && puzzleTimerStartTime === 0) { text("Status: Fan OFF. Turn Fan ON to start timer.", width / 2, height / 2 + 50); }
        else if (fanOn && puzzleTimerStartTime === 0) { text("Status: Fan ON. Timer started!", width / 2, height / 2 + 50); puzzleTimerStartTime = millis(); }
        else if (fanOn && puzzleTimerStartTime > 0) { text("Status: Fan ON. Keep it on!", width / 2, height / 2 + 50); if (elapsedTime >= puzzleTargetDuration) { handlePuzzleSuccess(activePuzzle); } }
        else if (!fanOn && puzzleTimerStartTime > 0) { text("Status: Fan OFF. Timer reset!", width / 2, height / 2 + 50); puzzleTimerStartTime = 0; puzzleFeedbackMessage = "Fan turned off too soon! Try again."; }
      } else if (activePuzzle === 'bedroom_light') {
         if (!ledOn && puzzleTimerStartTime === 0) { text("Status: LED OFF. Turn LED ON to start timer.", width / 2, height / 2 + 50); }
         else if (ledOn && puzzleTimerStartTime === 0) { text("Status: LED ON. Timer started!", width / 2, height / 2 + 50); puzzleTimerStartTime = millis(); }
         else if (ledOn && puzzleTimerStartTime > 0) { text("Status: LED ON. Keep it on!", width / 2, height / 2 + 50); if (elapsedTime >= puzzleTargetDuration) { handlePuzzleSuccess(activePuzzle); } }
         else if (!ledOn && puzzleTimerStartTime > 0) { text("Status: LED OFF. Timer reset!", width / 2, height / 2 + 50); puzzleTimerStartTime = 0; puzzleFeedbackMessage = "LED turned off too soon! Try again."; }
      }
    } else if (activePuzzle === 'livingRoom_temp') {
      fill(200); rectMode(CENTER); rect(width / 2, height / 2 + 50, 200, 40);
      fill(0); textSize(24); text(puzzleInput + "_", width / 2, height / 2 + 50);
    }
    fill(255, 255, 0); textSize(18); text(puzzleFeedbackMessage, width / 2, height / 2 + 100);
    textAlign(LEFT, BASELINE); rectMode(CORNER);
  }
}

function handlePuzzleSuccess(puzzleType) {
    if (puzzleType === 'bathroom_fan') {
        bathroomToBedroomDoorUnlocked = true;
        puzzleFeedbackMessage = "Success! Door to Bedroom unlocked!";
    } else if (puzzleType === 'bedroom_light') {
        bedroomToLivingRoomDoorUnlocked = true;
        bathroomToLivingRoomDoorUnlocked = true;
        puzzleFeedbackMessage = "Success! Door to Living Room unlocked!";
    }
    setTimeout(() => {
        activePuzzle = null;
        puzzleFeedbackMessage = '';
        puzzleTimerStartTime = 0;
    }, 1500);
}

function mousePressed() {
  if (activePuzzle === 'bathroom_fan' || activePuzzle === 'bedroom_light') {
    activePuzzle = null; puzzleFeedbackMessage = ''; puzzleTimerStartTime = 0;
  }
  if (activePuzzle === null || activePuzzle === 'bathroom_fan' || activePuzzle === 'bedroom_light') {
      if (mouseX > ledButton.x && mouseX < ledButton.x + ledButton.w &&
          mouseY > ledButton.y && mouseY < ledButton.y + ledButton.h) {
          ledBrightness = (ledOn ? 0 : 255);
      }
      if (mouseX > fanButton.x && mouseX < fanButton.x + fanButton.w &&
          mouseY > fanButton.y && mouseY < fanButton.y + fanButton.h) {
          fanOn = !fanOn;
      }
    }
  }

  function drawButtons() {
    fill(100, 100, 250);
    rect(ledButton.x, ledButton.y, ledButton.w, ledButton.h, 5);
    fill(255); textSize(14); textAlign(CENTER, CENTER);
    text(ledButton.text, ledButton.x + ledButton.w / 2, ledButton.y + ledButton.h / 2);

    fill(100, 250, 100);
    rect(fanButton.x, fanButton.y, fanButton.w, fanButton.h, 5);
    fill(255);
    text(fanButton.text, fanButton.x + fanButton.w / 2, fanButton.y + fanButton.h / 2);
    textAlign(LEFT, BASELINE);
  }

  function drawDebugDoorZones() {
    noFill();
    stroke(255, 0, 0, 150);
    strokeWeight(1);

    const hX = houseTopLeftX;
    const hY = houseTopLeftY;

    let door = doorBathroomBedroom;
    stroke(isCharNearDoor(charX, charY, door) ? color(0, 255, 0, 150) : color(255, 0, 0, 150));
    rectMode(CENTER);
    rect(hX + door.x, hY + door.y, door.width, door.height);

    door = bedroomToLivingRoomDoor;
    stroke(isCharNearDoor(charX, charY, door) ? color(0, 255, 0, 150) : color(255, 0, 0, 150));
    rect(hX + door.x, hY + door.y, door.width, door.height);

    door = bathroomToLivingRoomDoor;
    stroke(isCharNearDoor(charX, charY, door) ? color(0, 255, 0, 150) : color(255, 0, 0, 150));
    rect(hX + door.x, hY + door.y, door.width, door.height);

    door = livingRoomExitDoor;
    stroke(isCharNearDoor(charX, charY, door) ? color(0, 255, 0, 150) : color(255, 0, 0, 150));
    rect(hX + door.x, hY + door.y, door.width, door.height);

    rectMode(CORNER);
    noStroke();
  }


  function drawCharacter(x, y) {
    push();
    translate(x, y);
    fill(255, 200, 0);
    stroke(0);
    ellipse(0, 0, charSize, charSize);
    pop();
  }

  function drawEscapeScreen() {
    background(50, 200, 50);
    fill(255); textSize(60); textAlign(CENTER, CENTER);
    text("YOU ESCAPED!", width / 2, height / 2 - 50);
    textSize(24);
    text("Congratulations! You solved all the puzzles.", width / 2, height / 2 + 50);
    text("Refresh the page to play again.", width / 2, height / 2 + 100);
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    houseTopLeftX = (width / 2) - (TOTAL_HOUSE_WIDTH / 2);
    houseTopLeftY = (height / 2) - (TOTAL_HOUSE_HEIGHT / 2);
    charX = houseTopLeftX + BEDROOM_WIDTH + BATHROOM_WIDTH / 2;
    charY = houseTopLeftY + BATHROOM_HEIGHT / 2;
  }
>>>>>>> Stashed changes
