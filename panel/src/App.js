import { Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tables";
import Nopages from "./pages/Nopages";
import Users from "./pages/Users";
import Justifications from './pages/Justifications'; 
function App() {
  return (
<div >
      <Routes>
        <Route path="/" element={<Layout />}></Route>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tables" element={<Tables />} />
        <Route path="Users" element={<Users />} />
        <Route path="*" element={<Nopages />} />
        <Route path="Justifications" element={<Justifications />} />

      </Routes>
    </div>
  );
}

export default App;
