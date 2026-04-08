/**
 *  @file    MessageHandler.js
 *  @author  Corey Ford
 *  @date    March 2025
 *  @version 1.0
 *
 *  @section DESCRIPTION
 *
 *  Handles messages from the MQTT server for the house
 *
 */
'use strict';

/**
 * Handles incoming MQTT messages, parses them into JSON,
 * and provides helper functions to retrieve values based on specific criteria.
 */
class MessageHandler {
  /**
   * Initializes the message handler, sets up the WebSocket connection,
   * and listens for incoming MQTT messages.
   */
  constructor() {
    this.messages = [];
    this.socket = io.connect(`http://${document.domain}:5000`);
    this.socket.on('mqtt_message', (data) => this.handleMessage(data));
  }

  /**
   * Handles incoming MQTT messages by parsing JSON and storing it.
   * @param {Object} data The raw message data from WebSocket.
   */
  handleMessage(data) {
    try {
      const parsedData = JSON.parse(data.message);
      this.sendMessageToTextArea(parsedData);
      this.messages.push(parsedData);
      console.log('Message stored:', parsedData);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  /**
   * Sends the message to a textarea if it exists.
   * @param {Object} messages Parsed MQTT data.
   */
  sendMessageToTextArea(messages) {
    const messagesTextarea = document.getElementById('messages');
    if (messagesTextarea) {
      messagesTextarea.value += JSON.stringify(messages);
      messagesTextarea.scrollTop = messagesTextarea.scrollHeight;
    }
  }

  /**
   * Retrieves the most recent value for a component in a specific room and house.
   * @param {string} component Component name (e.g., 'led').
   * @param {string} room Room name (e.g., 'living').
   * @param {string} house House name (default: 'middle').
   * @returns {string|null} Most recent value or null if not found.
   */
  getMostRecentValueForComponent(component, room, house = 'middle') {
    const filteredMessages = this.messages.filter(
      (msg) => msg.component === component && msg.room === room && msg.house === house
    );
    return filteredMessages.length ? filteredMessages.at(-1).value : null;
  }

  /**
   * Retrieves all messages for a specific room.
   * @param {string} room Room name.
   * @returns {Array<Object>} Array of messages for the room.
   */
  getAllValuesForRoom(room) {
    return this.messages.filter((msg) => msg.room === room);
  }

  /**
   * Retrieves all messages for a specific house.
   * @param {string} house House name.
   * @returns {Array<Object>} Array of messages for the house.
   */
  getAllValuesForHouse(house) {
    return this.messages.filter((msg) => msg.house === house);
  }

  /**
   * Sends a structured JSON message to the MQTT server via WebSocket.
   * @param {string} house House name.
   * @param {string} room Room name.
   * @param {string} component Component name.
   * @param {string} value Value to be sent.
   * @param {string} [msg=''] Optional additional message.
   */
  sendMessageToMQTT(house, room, component, value, msg = '') {
    if (this.socket) {
      const fullMessage = { house, room, component, value, message: msg };
      this.socket.emit('send_mqtt_message', { message: JSON.stringify(fullMessage) });
      console.log('Sent message to MQTT:', fullMessage);
    } else {
      console.error('WebSocket connection not established.');
    }
  }
}
