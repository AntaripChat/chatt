import React, { useState, useEffect } from "react";
import { database, auth } from "../config/firebase";
import { ref, push, onValue, remove, update } from "firebase/database";
import { FaTrash, FaEdit, FaHeart } from "react-icons/fa"; // Import heart icon

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, "messages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.entries(data));
      }
    });
  }, []);

  const handleSendMessage = async () => {
    const user = auth.currentUser;
    if (user) {
      const messagesRef = ref(database, "messages");
      await push(messagesRef, {
        text: newMessage,
        timestamp: Date.now(),
        uid: user.uid,
        username: user.displayName || "User",
        loves: {}, // Initialize loves as an empty object
      });
      setNewMessage("");
    } else {
      alert("You must be logged in to send a message.");
    }
  };

  const handleDeleteMessage = async (key, messageUid) => {
    const user = auth.currentUser;
    if (user && user.uid === messageUid) {
      const messageRef = ref(database, `messages/${key}`);
      await remove(messageRef);
    } else {
      alert("You can only delete your own messages.");
    }
  };

  const handleUpdateMessage = async (key, messageUid, newText) => {
    const user = auth.currentUser;
    if (user && user.uid === messageUid) {
      const messageRef = ref(database, `messages/${key}`);
      await update(messageRef, { text: newText });
    } else {
      alert("You can only update your own messages.");
    }
  };

  const handleLoveMessage = async (key, loves) => {
    const user = auth.currentUser;
    if (user) {
      const messageRef = ref(database, `messages/${key}/loves`);
      const updatedLoves = { ...loves };
      if (updatedLoves[user.uid]) {
        delete updatedLoves[user.uid];
      } else {
        updatedLoves[user.uid] = true;
      }
      await update(ref(database, `messages/${key}`), { loves: updatedLoves });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="h-screen bg-green-200 flex flex-col items-center justify-center">
      <div className="flex-1 overflow-y-auto p-4 w-full max-w-md mb-12">
        {messages.map(([key, message]) => {
          const isCurrentUser = auth.currentUser && auth.currentUser.uid === message.uid;
          const lovesCount = message.loves ? Object.keys(message.loves).length : 0;
          const hasLoved = auth.currentUser && message.loves && message.loves[auth.currentUser.uid];
          return (
            <div
              key={key}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  isCurrentUser ? "bg-blue-500 text-white" : "bg-white shadow-sm"
                }`}
              >
                <div className="text-sm font-bold">{message.username}</div>
                <p className="mt-1">{message.text}</p>
                <div className="text-xs text-gray-400 mt-1">
                  {formatTimestamp(message.timestamp)}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => handleLoveMessage(key, message.loves || {})}
                    className={`text-sm ${hasLoved ? "text-red-600" : "text-gray-500"} hover:text-red-600`}
                  >
                    <FaHeart /> {lovesCount}
                  </button>
                  {isCurrentUser && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateMessage(
                            key,
                            message.uid,
                            prompt("Update message:", message.text)
                          )
                        }
                        className="text-sm text-gray-500 hover:text-green-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(key, message.uid)}
                        className="text-sm text-gray-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white shadow-lg p-4 fixed bottom-0 w-full max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Type a message..."
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-green-300"
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
