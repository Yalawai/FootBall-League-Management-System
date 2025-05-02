import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import News from "./components/News";
import Matches from './pages/Matches';
import LeaguePage from './pages/LeaguePage';
import FixturePage from "./pages/FixturePage";
import NewsPage from "./pages/NewsPage";
import ResultsPage from "./pages/ResultsPage";
import ResultDetail from "./components/ResultDetail";

import FacebookPost from "./components/facebookpost";



function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home />}></Route>
      <Route path='/fixtures' element={<FixturePage/>}/>
      <Route path="/news/:id" element={<News/>} />
      <Route path="/result/:id" element={<ResultDetail/>} />


      <Route path="/about" element={<FacebookPost url="https://www.facebook.com/bobbhutanpremierleague/posts/pfbid02HgEEvHDAbiYLAENqFEknjjMYeYBdqbv73eYbJfeGYS9D89dcKTQcNDxFcSvmr6VTl"/>} />
      
      <Route path="/news_list" element={<NewsPage/>} />
      <Route path="/results_list" element={<ResultsPage/>} />
      <Route path="/matches" element={<Matches/>} />
      <Route path="/league" element={<LeaguePage/>} />

    </Routes>
    
    </BrowserRouter>
  
  )
}

export default App
