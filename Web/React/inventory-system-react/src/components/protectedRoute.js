import { Navigate, Route } from "react-router-dom";
import AuthContext from "../context/authContext";
import { useContext } from "react";
import MainComponent from "./mainComponent";

const ProtectedComponent = ({ component: Component, roles }) => {
  let { user, group } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.some((role) => group.includes(role))) {
    return <Navigate to="/" />;
  }

  return (
    <MainComponent>
      <Component />
    </MainComponent>
  );
};

export default ProtectedComponent;
