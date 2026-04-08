# IOT HOUSE PROJECT

This project is an interactive 2D simulation of a smart house, designed as an escape room game where you must solve sequential puzzles leveraging virtual IoT devices to escape.

How It Works (Escape Game Mode)
Your objective is to escape the house by solving a series of puzzles that unlock doors between rooms.

House View: You'll navigate a 2D layout of a house with a Bedroom, Bathroom, and Living Room, complete with furniture.
Your Character: A yellow circular character is your avatar. Use the arrow keys to move your character around. You will be confined to your current room until its puzzle is solved.
The Escape Sequence & Puzzles
The game follows a strict room progression. You must solve the puzzle in your current room to unlock the path to the next.

Starting Room: The Bathroom

Puzzle: Fan Power
How to Activate: While in the Bathroom, press the '1' key on your keyboard.
How to Solve: A puzzle overlay will appear. Use the "Toggle Fan" button (green, top-left of screen) to turn the bathroom fan ON. Keep the fan running for the exact duration shown on the puzzle's timer (e.g., 5-7 seconds).
Unlocks: The door from the Bathroom to the Bedroom.
Transition: Guide your character through the newly unlocked doorway into the Bedroom.
Next Room: The Bedroom

Puzzle: Light Cycle
How to Activate: While in the Bedroom, press the '2' key on your keyboard.
How to Solve: Use the "Toggle LED" button (blue, top-left of screen) to turn the room lights ON. Keep the LEDs on for the exact duration shown on the puzzle's timer (e.g., 3-5 seconds).
Unlocks: The door from the Bedroom to the Living Room.
Transition: Guide your character through the newly unlocked doorway into the Living Room.
Final Room: The Living Room

Puzzle: Temperature Code
How to Activate: While in the Living Room, press the '3' key on your keyboard.
How to Solve: You need a password! The password is the exact house temperature. Look for the temperature display in the top-right corner of the Living Room (you can press the 'T' key to toggle its visibility if needed). Input the temperature value (e.g., 20.5) using your keyboard, then press Enter to submit.
Unlocks: The final Exit Door from the house.
Transition: Guide your character through the final exit to escape!
IoT Device Controls (Within Puzzle Context)
The "Toggle LED" and "Toggle Fan" buttons are your primary tools to interact with the virtual IoT devices and solve the timed puzzles.
The Temperature display provides the crucial clue for the final puzzle.
Motion Sensor: While not directly controlled by you, the Living Room's LEDs will also react to simulated "motion" (if your MessageHandler.js is set up for it), which can be part of the dynamic environment but isn't a direct puzzle input.
