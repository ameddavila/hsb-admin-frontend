// src/App.tsx
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Unauthorized from "./pages/OtherPage/Unauthorized";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./routes/ProtectedRoute";
import DynamicRoutes from "./routes/DynamicRoutes";

import Home from "./pages/Dashboard/Home";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import FormElements from "./pages/Forms/FormElements";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";

export default function App() {
   useAutoRefresh();
  //console.log("🚀 App cargada, renderizando <Routes>...");

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* 🔐 Rutas protegidas */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />

{/* ✅ Rutas dinámicas generadas */}
    {...DynamicRoutes()}
        </Route>

        {/* 🔓 Rutas públicas */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ❌ Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
