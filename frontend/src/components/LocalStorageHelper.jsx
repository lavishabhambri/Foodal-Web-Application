function setLocalStorage(token, userType) {
    localStorage.setItem("jwt_token","Bearer " + token);
	localStorage.setItem("user_type", userType);
}

function deleteLocalStorage(token, userType) {
    localStorage.removeItem("jwt_token");
	localStorage.removeItem("user_type");
}

function returnLocalStorage() {
    const data = {
        token: localStorage.getItem("jwt_token"),
        userType: localStorage.getItem("user_type"),
    }
    return data;
}

export { setLocalStorage, deleteLocalStorage, returnLocalStorage};