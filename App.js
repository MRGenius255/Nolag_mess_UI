import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';


const socket = io('https://YOUR_BACKEND_URL'); // <-- сюда URL Railway


export default function App() {
const [username, setUsername] = useState('');
const [joined, setJoined] = useState(false);
const [online, setOnline] = useState([]);
const [messages, setMessages] = useState([]);
const [text, setText] = useState('');
const [typingUser, setTypingUser] = useState(null);


useEffect(() => {
socket.on('online', setOnline);
socket.on('private_message', (msg) => setMessages((m) => [...m, msg]));
socket.on('typing', setTypingUser);
}, []);


const join = () => {
socket.emit('join', { username });
setJoined(true);
};


const sendMessage = () => {
if (!text) return;
socket.emit('private_message', { user: username, text, type: 'text' });
setMessages((m) => [...m, { user: 'me', text, type: 'text' }]);
setText('');
};


return !joined ? (
<div className="min-h-screen flex items-center justify-center">
<div className="w-80 p-6 bg-white rounded-2xl shadow-lg">
<input
className="border p-2 rounded w-full mb-3"
placeholder="Введите имя"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>
<button className="w-full bg-blue-500 text-white p-2 rounded" onClick={join}>Войти</button>
</div>
</div>
) : (
<div className="min-h-screen flex">
<div className="w-64 bg-white p-4 border-r">
<h2 className="font-semibold mb-2">Online</h2>
{online.map((u, i) => (<div key={i}>🟢 {u}</div>))}
</div>
<div className="flex-1 flex flex-col p-4">
<div className="flex-1 overflow-y-auto">
{messages.map((m, i) => (
<div key={i} className="mb-2"><b>{m.user}:</b> {m.text}</div>
))}
{typingUser && <div className="text-xs">{typingUser} печатает...</div>}
</div>
<div className="flex gap-2">
<input
className="border p-2 rounded flex-1"
placeholder="Сообщение"
value={text}
onChange={(e) => { setText(e.target.value); socket.emit('typing'); }}
/>
<button className="bg-blue-500 text-white p-2 rounded" onClick={sendMessage}>➤</button>
</div>
</div>
</div>
);
}