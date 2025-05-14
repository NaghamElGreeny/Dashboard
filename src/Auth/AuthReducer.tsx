enum AuthActionTypes {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
  }

  type AuthState = {
    currentUser: string | null;
  };

  type AuthAction = {
    type: AuthActionTypes;
    payload?: any; // Modify the payload type if needed
  };

  const AuthReducer = (state: AuthState, action: AuthAction) => {
    switch (action.type) {
      case AuthActionTypes.LOGIN: {
        return {
          currentUser: localStorage.getItem("token") || null,
        };
      }
      case AuthActionTypes.LOGOUT: {
        return {
          currentUser: null,
        };
      }
      default:
        return state;
    }
  };

  export default AuthReducer;
