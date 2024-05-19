export const saveToken = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
