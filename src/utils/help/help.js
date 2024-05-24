export const saveToken = (accessToken, refreshToken, role) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("role", role);
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
