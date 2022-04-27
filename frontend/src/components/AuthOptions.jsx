import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";

import { Button } from "@material-ui/core";
import { AuthButton } from "./styled";

function AuthOptions() {
	const { userData, setUserData } = useContext(UserContext);
	const history = useHistory();

	const register = () => history.push("/register");
	const login = () => history.push("/login");
	const logout = () => {
		setUserData({
			token: undefined,
			user: undefined,
		});
		localStorage.setItem("auth-token", "");
	};

	return (
		<>
			{userData.user ? (
				<AuthButton variant="outlined" color="primary" onClick={logout}>
					Login
				</AuthButton>
			) : (
				<div>
					<AuthButton
						variant="outlined"
						color="secondary"
						onClick={register}
					>
						Sign Up
					</AuthButton>
					<AuthButton
						variant="outlined"
						color="primary"
						onClick={login}
					>
						Login
					</AuthButton>
				</div>
			)}
		</>
	);
}

export default AuthOptions;