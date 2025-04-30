'use client'

import { useEffect, useState } from 'react'

export default function TestPage(){
  const [socket, setSocket] = useState<WebSocket>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const ws = new WebSocket("wss://api.wildfire.moveto.kr/ws");

    ws.onopen = () => {
      console.log("WebSocket 연결 완료");
    };

    ws.onmessage = (event) => {
      console.log("서버로부터 메시지 수신:", event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket 에러 발생:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    setSocket(ws);

    // 컴포넌트 언마운트 시 소켓 닫기
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(input);
      setInput("");
    }
  };

  return <div className={'w-screen h-screen flex items-center justify-center'}>
    <div>Hello</div>
  </div>
}