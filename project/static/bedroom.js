// bedroom.js (2D Version - Furniture & LED Added)

/**
 * @file    bedroom.js
 * @author  Corey Ford
 * @date    June 2025 (Updated)
 * @version 1.5 (2D No Gaps Layout - Furniture, LED)
 * @section DESCRIPTION
 * P5js sketch component for drawing the bedroom in 2D.
 */

// Function to draw the bedroom
// x, y are the 2D coordinates for the TOP-LEFT of the bedroom
function drawBedroom(x, y, roomWidth, roomHeight, ledState, brightness) { // Added ledState, brightness
  push(); // Isolate transformations for this room
  translate(x, y); // Move to the bedroom's designated 2D position

  // --- Draw the Bedroom Structure (fill only, NO STROKE) ---
  noStroke();
  fill(255, 200, 200); // Light pink for bedroom interior

  // Main room footprint
  rect(0, 0, roomWidth, roomHeight);

  // --- Draw Bedroom Furniture ---

  // Bed (large rectangle)
  fill(100, 50, 0); // Brown bed frame
  rect(roomWidth * 0.3, roomHeight * 0.4, roomWidth * 0.6, roomHeight * 0.5); // Bed base
  fill(200, 220, 255); // Light blue for bedding
  rect(roomWidth * 0.3 + 5, roomHeight * 0.4 + 5, roomWidth * 0.6 - 10, roomHeight * 0.5 - 10); // Mattress/sheets
  fill(150, 120, 90); // Pillow color
  rect(roomWidth * 0.3 + 10, roomHeight * 0.4 + 10, roomWidth * 0.55 - 10, roomHeight * 0.1); // Pillow

  // Nightstands
  fill(120, 70, 20); // Darker brown
  rect(roomWidth * 0.2, roomHeight * 0.7, 30, 20); // Left nightstand
  rect(roomWidth * 0.9 - 30, roomHeight * 0.7, 30, 20); // Right nightstand

  // Wardrobe/Closet (dark brown rectangle from screenshot, adjusted position)
  fill(100, 50, 0);
  rect(roomWidth * 0.05, roomHeight * 0.05, roomWidth * 0.2, roomHeight * 0.7); // Placed top-left

  // Text for room name
  fill(50);
  textFont(defaultFont);
  textSize(roomHeight * 0.1);
  textAlign(LEFT, TOP);
  text("Bedroom", 5, 5);

  // --- Draw Bedroom LED Strip ---
  drawBedroomLEDStrip(0, 0, roomWidth, ledState, brightness); // Positioned at top-left of room

  pop(); // Restore previous transformations
}

// Function to draw the LED strip for the Bedroom
function drawBedroomLEDStrip(x, y, parentRoomWidth, isOn, brightness) {
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