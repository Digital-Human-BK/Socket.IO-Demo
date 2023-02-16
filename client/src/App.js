import io from "socket.io-client";
import { useEffect, useState } from "react";
import "./App.css";

const socket = io.connect("http://localhost:3030");

function App() {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const sendMessageHandler = () => {
    if (message.trim() !== "" && user.trim() !== "") {
      setChatMessages((prev) => [
        ...prev,
        { message: message.trim(), room: room.trim(), user: user.trim() },
      ]);

      socket.emit("send_message", {
        message: message.trim(),
        room: room.trim(),
        user: user.trim(),
      });
    }
    setMessage("");
  };

  const joinRoomHandler = () => {
    if (room.trim() !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChatMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <ul className="messages-container">
          {chatMessages.map((data) => (
            <li
              className={data.user === user ? "owner" : "buddy"}
              key={`id-${data.message}`}
            >
              {data.user !== user && (
                <span className="avatar">
                  <span>{data.user}</span>
                </span>
              )}
              {data.message}
            </li>
          ))}
        </ul>
        <div className="flex-row">
          <div className="flex-row">
            <input
              className="flex-input"
              type="text"
              placeholder="Username..."
              value={user}
              onChange={(ev) => setUser(ev.target.value)}
            />
            <button
              className="flex-btn confirm"
              // disabled={!Boolean(room)}
              // onClick={joinRoomHandler}
            >
              Okay
            </button>
          </div>

          <div className="flex-row">
            <input
              className="flex-input"
              type="text"
              placeholder="Create room"
              value={room}
              onChange={(ev) => setRoom(ev.target.value)}
            />
            <button
              className="flex-btn join"
              disabled={!Boolean(room)}
              onClick={joinRoomHandler}
            >
              Join
            </button>
          </div>
        </div>

        <div className="full-width">
          <input
            className="fw-input"
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
          />
          <button
            className="msg-btn send"
            disabled={!Boolean(message)}
            onClick={sendMessageHandler}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
