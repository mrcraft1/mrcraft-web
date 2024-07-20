// ** Router imports
import { lazy } from 'react'
// ** Router imports
import { useRoutes } from 'react-router-dom'
// ** GetRoutes
import { getRoutes } from './routes'



// ** Components
const PageNotFound = lazy(() => import("../Pages/PageNotFound"));

const Router = () => {
  // ** Hooks
  const allRoutes = getRoutes()
  

  const routes = useRoutes([   
    ...allRoutes,
    {
      path: '/*',
      element: <PageNotFound />
    },
  ])

  // console.log("routes",routes)
  return routes
}

export default Router