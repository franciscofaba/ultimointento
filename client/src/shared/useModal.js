import { useState } from "react";


export const useModal = (initialValue= false)=>{
const[isOpen, setisOpen]=useState(initialValue);
const openModal=()=>setisOpen(true);
const closeModal=()=>setisOpen(false);
return [isOpen,openModal,closeModal];
}
//
//import React, { useState } from 'react'
//import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
//import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
//import { ThemeProvider } from 'styled-components'
//import Post from './Post'
//import Link from './Link'

//const theme = {
//background: '#f5f8fb',
//fontFamily: 'Helvetica Neue',
//headerBgColor: '#0f4d4a',
//headerFontColor: '#fff',
//headerFontSize: '15px',
//botBubbleColor: '#0f4d4a',
//botFontColor: '#fff',
//userBubbleColor: '#fff',
//userFontColor: '#4a4a4a',
//}

//// all available config props
//const config = {
//width: '1000px',
//height: '400px',
//hideUserAvatar: true,
//placeholder: 'Type your response.',
//headerTitle: 'ChatBot',
//}

//const Chatbot = (props) => {
//let [showChat, setShowChat] = useState(false)

//const startChat = () => {
////setShowChat(true)
//}
//const hideChat = () => {
////setShowChat(false)
//}

//return (
////<ThemeProvider theme={theme}>
////<div style={{ display: showChat ? 'none' : '' }}>
//////<ChatBot
//////speechSynthesis={{ enable: true, lang: 'en-ES' }}
//////recognitionEnable={true}
//////steps={[
////////{
////////id: 'welcome',
////////message: 'Hola!',
////////trigger: 'q-firstname',
////////},
/////////* Paste */
////////{
////////id: 'q-firstname',
////////message: '¿Cual es tu nombre?',
////////trigger: 'firstname',
////////},
////////{
////////id: 'firstname',
////////user: true,
////////validator: (value) => {
//////////if (/^[A-Za-z]+$/.test(value)) {
//////////return true
//////////} else {
//////////return 'Por favor, ingrese solo caracteres alfabéticos.'
//////////}
////////},
////////trigger: 'rmcbot',
////////},
////////{
////////id: 'rmcbot',
////////message:
//////////'Hola,{previousValue}, ¡Soy CRM Bot! ¿En qué puedo ayudarte?',
////////trigger: 'qtype',
////////},
////////{
////////id: 'qtype',
////////options: [
//////////{ value: 1, label: '¿asistencias?', trigger: '4' },
//////////{ value: 2, label: 'Horario', trigger: '3' },
//////////{ value: 3, label: 'Malla curricular', trigger: '5' },
//////////{ value: 4, label: 'Mas Informacion', trigger: '6' },
////////],
////////},
////////{
////////id: '3',
////////message:
//////////'No disponible, estamos trabajando en ello.!',
////////trigger: 'qtype',
////////},
////////{
////////id: '4',
////////message:
//////////'No disponible, estamos trabajando en ello.',
////////trigger: 'qtype',
////////},
////////{
////////id: '5',
////////message:
//////////'No disponible, estamos trabajando en ello.',
////////trigger: 'qtype',
////////},
////////{
////////id: '6',
////////component: <Link />,
////////trigger: 'q-submit',
////////},
////////{
////////id: 'q-submit',
////////message: '¿Tienes alguna otra pregunta?',
////////trigger: 'submit',
////////},
////////{
////////id: 'submit',
////////options: [
//////////{ value: 'y', label: 'Yes', trigger: 'no-submit' },
//////////{ value: 'n', label: 'No', trigger: 'end-message' },
////////],
////////},
////////{
////////id: 'no-submit',
////////options: [
//////////{ value: 1, label: '¿asistencias?', trigger: '4' },
//////////{ value: 2, label: 'Horario', trigger: '3' },
//////////{ value: 3, label: 'Malla curricular', trigger: '5' },
//////////{ value: 4, label: 'Mas Informacion', trigger: '6' },
////////],
////////},
////////{
////////id: 'end-message',
////////component: <Post />,
////////asMessage: true,
////////end: true,
////////},
//////]}
//////{...config}
///////>
////</div>
////<div>
//////{!showChat ? (
//////<button className="btn" onClick={() => startChat()}>
////////<i className="fa fa-minus"></i>
//////</button>
//////) : (
//////<button className="btn" onClick={() => hideChat()}>
////////<i className="fa fa-plus"></i>
//////</button>
//////)}
////</div>
////</ThemeProvider>
//)
//}

//export default Chatbot
