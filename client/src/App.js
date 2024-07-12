import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Top from "./shared/top_login";
import Navbar from "./shared/Navbar";
import Navbaralumnos from "./shared/Navbar_alumnos";
import  Portal  from "./pages/Portal";
import Portal2 from "./pages/Portal2/index";
import Portal2_ver_asistencia from "./pages/Portal2/index_ver_asistencia";
import Portal2_contar_asistencia from "./pages/Portal2/index_contar_asistencia";
import Iniciar from "./pages/confirmarAsistencia/Iniciar";
import AttendanceStudent from "./pages/AttendancePageStudent/indexAttendance"
import Inicio from "./pages/Inicio/index";
import InformacionCursos from "./pages/InformacionCursos/IndexInformacionCursos";
import Portal2_chatbot from "./pages/Portal2_chatbot/index";
import SubirImagen from "./pages/SubirFotos/fotos";
import 'semantic-ui-css/semantic.min.css'
import "./App.css";
import Pagina from "./pages/prueba";
import Pagina2 from "./pages/prueba2"
import Estado from "./pages/Encuesta/Encuesta";
import backgroundImage from './images/fondo-biblioteca-pregrado-santiago.jpg';

function App() {
	const [user, setUser] = useState(null);

	

	return (
		<div style = {{
			backgroundImage: ` linear-gradient(to bottom,rgb(0 0 139 / 50%),rgb(34 139 34 / 80%)) , url(${backgroundImage})`, 
			// backgroundPosition: 'center',
			// backgroundRepeat: 'no-repeat',
			// width: "2350px",
			// minHeight: '100vh',
			
		  }}>
			<Routes>
				<Route
					
					path="/"
					element={user ? <Home user={user} /> : <Navigate to="/login" />}
				/>
				<Route
					
					path="/login"
					element={user ? <Navigate to="/" /> : <Login />}
				/>
				<Route
					
					path="/signup"
					element={user ? <Navigate to="/" /> : <Signup />}
				/>
				<Route
					
					path="/subirimagen"
					element={user ? <Navigate to="/" /> : <SubirImagen />}
				/>
				<Route
			
					path="/portal"
					element={user ? <Navigate to="/" /> : <Portal />}
				/>
				<Route
					path="/portal2"
					element={user ? <Navigate to="/" /> : <Portal2 />}
				/>

				<Route
					path="/portal2_ver_asistencia"
					element={user ? <Navigate to="/" /> : <Portal2_ver_asistencia />}
				/>

				<Route
					path="/portal2_contar_asistencia"
					element={user ? <Navigate to="/" /> : <Portal2_contar_asistencia />}
				/>


				<Route
					path="/portal2_chatbot"
					element={user ? <Navigate to="/" /> : <Portal2_chatbot />}
				/>

				<Route
					path="/inicio"
					element={user ? <Navigate to="/" /> : <Inicio />}
				/>
				<Route
					path="/pagina"
					element={user ? <Navigate to="/" /> : <Pagina />}
				/>
				<Route
					path="/pagina2"
					element={user ? <Navigate to="/" /> : <Pagina2 />}
				/>		
				<Route
					path="/Estado/:idUser/:idCourseInProgress"
					element={user ? <Navigate to="/" /> : <Estado />}
				/>
				<Route 
				path="/Top" 
				element={<Top />}/>

				<Route 
				path="/Navbar" 
				element={<Navbar />}/>

				<Route 
				path="/Navbaralumnos" 
				element={<Navbaralumnos />}/>

				<Route
					path="/iniciar"
					element={user ? <Navigate to="/" /> : <Iniciar />}
				/>


				<Route
					path="/Justifications"
					element={user ? <Navigate to="/" /> : <AttendanceStudent />}
				/>

				<Route
					path="/informacioncursos"
					element={user ? <Navigate to="/" /> : <InformacionCursos />}
				/>
				
			</Routes>
		</div>
	);
}

export default App;
