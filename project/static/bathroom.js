// bathroom.js (2D Version - Furniture, Fan & LED Added)

/**
 * @file    bathroom.js
 * @author  Corey Ford
 *
 * @date    June 2025 (Updated)
 * @version 1.5 (2D No Gaps Layout - Furniture, Fan, LED)
 * @section DESCRIPTION
 * P5js sketch component for drawing the bathroom in 2D.
 */

// Function to draw the bathroom
// x, y are the 2D coordinates for the TOP-LEFT of the bathroom
function drawBathroom(x, y, roomWidth, roomHeight, fanState, ledState, brightness) { // Added ledState, brightness
  push(); // Isolate transformations for this room
  translate(x, y); // Move to the bathroom's designated 2D position

  // --- Draw the Bathroom Structure (fill only, NO STROKE) ---
  noStroke();
  fill(170, 200, 255); // Light blue for bathroom interior

  // Main room footprint
  rect(0, 0, roomWidth, roomHeight);

  // --- Draw Bathroom Fixtures ---

  // Toilet (refined representation)
  fill(255); // White
  stroke(0); // Small stroke for fixtures
  strokeWeight(1);
  ellipse(roomWidth * 0.3, roomHeight * 0.7, roomWidth * 0.2, roomHeight * 0.25); // Toilet bowl
  rect(roomWidth * 0.3 - roomWidth * 0.08, roomHeight * 0.55, roomWidth * 0.16, roomHeight * 0.1); // Toilet tank
  noStroke();

  // Sink/Vanity
  fill(180); // Grey counter
  rect(roomWidth * 0.7, roomHeight * 0.2, roomWidth * 0.25, roomHeight * 0.15); // Vanity counter
  fill(150, 100, 50); // Cabinet below
  rect(roomWidth * 0.7, roomHeight * 0.35, roomWidth * 0.25, roomHeight * 0.3); // Cabinet below
  fill(255); // White sink bowl
  ellipse(roomWidth * 0.7 + roomWidth * 0.125, roomHeight * 0.2 + roomHeight * 0.075, roomWidth * 0.1, roomHeight * 0.08); // Sink bowl
  fill(100); // Faucet
  rect(roomWidth * 0.75 - 3, roomHeight * 0.1, 6, 10);
  ellipse(roomWidth * 0.75, roomHeight * 0.1, 8, 8); // Faucet head

  // Shower/Bathtub (simple rectangle)
  fill(200, 220, 255); // Light blue/grey for tub
  rect(roomWidth * 0.05, roomHeight * 0.05, roomWidth * 0.2, roomHeight * 0.4); // Shower/Tub enclosure

  // Draw the fan
  drawFan(roomWidth * 0.8, roomHeight * 0.8, roomWidth * 0.15, fanState); // Positioned bottom-right

  // Text for room name
  noStroke(); // Turn off stroke for text
  fill(50);
  textFont(defaultFont);
  textSize(roomHeight * 0.1);
  textAlign(LEFT, TOP);
  text("Bathroom", 5, 5);

  // --- Draw Bathroom LED Strip ---
  drawBathroomLEDStrip(0, 0, roomWidth, ledState, brightness); // Positioned at top-left of room

  pop(); // Restore previous transformations
}

// Function to draw the fan and animate it (no changes here, already good)
function drawFan(x, y, size, fanState) {
  push();
  translate(x, y);

  // Fan casing
  fill(150);
  ellipse(0, 0, size, size); // Outer casing

  // Fan blades
  stroke(0);
  strokeWeight(1);
  fill(200);

  // Animate fan based on its state and global fanAngle from sketch.js
  rotate(fanAngle); // fanAngle is updated in sketch.js draw()

  // Draw blades as lines or rectangles
  rectMode(CENTER);
  rect(0, 0, size * 0.8, size * 0.15); // Horizontal blade
  rect(0, 0, size * 0.15, size * 0.8); // Vertical blade

  pop();
}

// Function to draw the LED strip for the Bathroom
function drawBathroomLEDStrip(x, y, parentRoomWidth, isOn, brightness) {
  push();
  translate(x, y);

  let stripWidth = parentRoomWidth;
  let stripHeight = 10;

  if (isOn) {
    fill(255, 255, 0, brightness); // Yellow, with alpha based on brightness
  } else {
    fill(50); // Dark grey when off
  }
  noStroke();
  rect(0, 0, stripWidth, stripHeight);

  pop();
}