export const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const saveLogToLocalStorage = (log) => {
  const logs = getFromLocalStorage("logs") || [];
  logs.push(log);
  saveToLocalStorage("logs", logs);
};

export const loadLogsFromLocalStorage = () => {
  return getFromLocalStorage("logs") || [];
};

const newLog = "User logged in at " + new Date().toISOString();
saveLogToLocalStorage(newLog);

const logs = loadLogsFromLocalStorage();
console.log("Loaded logs from LocalStorage:", logs);

const user = { email: "user@example.com", password: "password123" };
saveToLocalStorage("user", user);
