import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { useSelector } from "react-redux";
import { fetchUsers, selectUsers } from "./features/user/usersSlice";
import { store } from "./store/store";
import { useEffect } from "react";
function App() {
  const users = useSelector(selectUsers);
  useEffect(() => {
    store.dispatch(fetchUsers());
  }, []);
  console.log(import.meta.env.VITE_ENVIRONMENT);
  return (
    <>
      <h1>React-boilerplate</h1>
      <div>
        <div>
          <h2> List of users </h2>
          {users.loading && <div>Loding ...</div>}
          {!users.loading && users.error ? <div>{}</div> : null}
          {!users.loading && users.users.length > 0 ? (
            <ul>
              {users.users.map((user, key) => (
                <li key={key}>{user.name}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <p className='read-the-docs'></p>

      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
      </Routes>
    </>
  );
}

export default App;
