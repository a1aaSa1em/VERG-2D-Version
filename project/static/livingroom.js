// livingroom.js (2D Version - Improved Furniture & Temperature)

/**
 * @file    livingroom.js
 * @author  Corey Ford
 * @date    June 2025 (Updated)
 * @version 1.5 (2D No Gaps Layout - Improved Furniture, Temperature)
 * @section DESCRIPTION
 * P5js sketch component for drawing the living room in 2D with identifiable furniture.
 */

// Function to draw the living room
// x, y are the 2D coordinates for the TOP-LEFT of the living room
function drawLivingRoom(x, y, roomWidth, roomHeight, ledState, currentTemp, displayTemp) {
  push(); // Isolate transformations for this room
  translate(x, y); // Move to the living room's designated 2D position

  // --- Draw the Living Room Structure (fill only, NO STROKE) ---
  noStroke();
  fill(150, 100, 50); // Brown for living room floor

  // Main room footprint
  rect(0, 0, roomWidth, roomHeight);

  // --- Draw Living Room Furniture ---

  // Rug (grey rectangle, centered)
  fill(200, 200, 200, 180); // Light grey, semi-transparent
  rectMode(CENTER); // Draw rug from center for easy positioning
  rect(roomWidth / 2, roomHeight / 2, roomWidth * 0.8, roomHeight * 0.6); // Center the rug

  // Couch (more detailed with cushions and backrest)
  let couchX = roomWidth * 0.4;
  let couchY = roomHeight * 0.7;
  let couchW = roomWidth * 0.4;
  let couchH = roomHeight * 0.15;

  fill(100, 150, 200); // Light blue
  rectMode(CORNER);
  rect(couchX, couchY, couchW, couchH); // Base
  rect(couchX, couchY - couchH * 0.4, couchW, couchH * 0.4); // Backrest
  rect(couchX - roomWidth * 0.05, couchY, roomWidth * 0.05, couchH); // Left armrest
  rect(couchX + couchW, couchY, roomWidth * 0.05, couchH); // Right armrest

  // Couch cushions
  fill(120, 170, 220); // Slightly lighter blue
  rect(couchX + couchW * 0.05, couchY + couchH * 0.1, couchW * 0.4, couchH * 0.7); // Left cushion
  rect(couchX + couchW * 0.55, couchY + couchH * 0.1, couchW * 0.4, couchH * 0.7); // Right cushion

  // Coffee table (with distinct top and implied legs)
  fill(120, 80, 40); // Darker brown
  rect(roomWidth * 0.4, roomHeight * 0.55, roomWidth * 0.2, roomHeight * 0.08); // Tabletop
  fill(150, 100, 50); // Lighter brown for side (implied leg)
  rect(roomWidth * 0.4 + roomWidth * 0.18, roomHeight * 0.55 + roomHeight * 0.08, roomWidth * 0.02, roomHeight * 0.05); // Implied leg/support

  // TV stand (rectangle with implied cabinets)
  fill(80); // Dark grey
  rect(roomWidth * 0.1, roomHeight * 0.1, roomWidth * 0.2, roomHeight * 0.1);
  stroke(50); // Cabinet lines
  strokeWeight(1);
  line(roomWidth * 0.1 + roomWidth * 0.1, roomHeight * 0.1, roomWidth * 0.1 + roomWidth * 0.1, roomHeight * 0.1 + roomHeight * 0.1);
  noStroke();

  // TV screen (with simple reflection)
  fill(10, 10, 10); // Black
  rect(roomWidth * 0.12, roomHeight * 0.12, roomWidth * 0.16, roomHeight * 0.08);
  fill(200, 200, 255, 50); // Light blue, semi-transparent for reflection
  triangle(roomWidth * 0.12, roomHeight * 0.12,
           roomWidth * 0.12 + roomWidth * 0.08, roomHeight * 0.12,
           roomWidth * 0.12, roomHeight * 0.12 + roomHeight * 0.04);
  
  // Reset rectMode for other drawings
  rectMode(CORNER);

  // Draw the LED strip (at the top edge of the room)
  drawLEDStrip(0, 0, roomWidth, ledState, ledBrightness); // Pass ledBrightness from sketch.js

  // --- Display Temperature ---
  if (displayTemp) { // Only display if showTemp is true (controlled by 'T' key)
    fill(255); // White text
    textFont(defaultFont);
    textSize(roomHeight * 0.08);
    textAlign(RIGHT, TOP); // Align to top-right
    text(`Temp: ${currentTemp.toFixed(1)}°C`, roomWidth - 10, 10); // Display in top-right corner
  }


  // Text for room name
  fill(50);
  textFont(defaultFont);
  textSize(roomHeight * 0.1);
  textAlign(LEFT, TOP);
  text("Living Room", 5, 5);

  pop(); // Restore previous transformations
}

// Function to draw the LED strip in 2D (no changes here, already good)
function drawLEDStrip(x, y, parentRoomWidth, isOn, brightness) {
  push();
  translate(x, y);

  let stripWidth = parentRoomWidth;
  let stripHeight = 10;

  if (isOn) {
    fill(255, 255, 0, brightness); // Yellow, with alpha based on brightness
    noStroke();
    rect(0, 0, stripWidth, stripHeight); // Drawn from top-left of its translated space
  } else {
    fill(50); // Dark grey when off
    noStroke();
    rect(0, 0, stripWidth, stripHeight);
  }

  pop();
}