import { useEffect } from 'react'
import { window as W } from "@neutralinojs/lib"
import { Route, Switch } from "wouter";
import './App.css'

import Home from './pages/Home'
import View from './pages/View'
import NotFound from './pages/NotFound'

export default function App() {
  useEffect(() => {
    W.show()
  }, [])

  return (
    <div className='flex flex-col h-screen'>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/view" component={View} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}