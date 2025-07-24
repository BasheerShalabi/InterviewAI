import React from 'react'
import HeaderComponent from '../components/HeaderComponent'
import { useAuth } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';
import FooterComponent from '../components/FooterComponent';
const ChatBoxPage = () => {
    const {user , logout}   = useAuth()
  return (
    <div>
        <HeaderComponent user={user} logout={logout} />
        <ChatBox/>
        <FooterComponent />
      
    </div>
  )
}

export default ChatBoxPage
