import { BrowserRouter, Route, Routes } from 'react-router';
import HousesScreen from './components/HousesScreen'
import '@aws-amplify/ui-react/styles.css';
import { AppLayout } from './layout/AppLayout';
import type { AuthUser } from 'aws-amplify/auth';

interface AppProps {
  user: AuthUser | undefined;
  signOut: (data?: any) => void;
}

function App({ user, signOut }: AppProps) {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout user={user} signOut={signOut} />}>
          <Route path="/" element={<HousesScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
