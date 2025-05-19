import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize the API keys from localStorage if they exist
const initApiKeys = () => {
  if (!localStorage.getItem('deepai_api_key')) {
    localStorage.setItem('deepai_api_key', '');
  }
  if (!localStorage.getItem('openai_api_key')) {
    localStorage.setItem('openai_api_key', '');
  }
};

// Initialize app data in localStorage
const initAppData = () => {
  if (!localStorage.getItem('todos')) {
    localStorage.setItem('todos', JSON.stringify([]));
  }
  if (!localStorage.getItem('habits')) {
    localStorage.setItem('habits', JSON.stringify([]));
  }
  if (!localStorage.getItem('journals')) {
    localStorage.setItem('journals', JSON.stringify({}));
  }
  if (!localStorage.getItem('zodiacInfo')) {
    localStorage.setItem('zodiacInfo', JSON.stringify({ month: '', day: '', sign: '' }));
  }
  if (!localStorage.getItem('userName')) {
    localStorage.setItem('userName', 'Guest');
  }
};

// Initialize app data before rendering
initApiKeys();
initAppData();

createRoot(document.getElementById("root")!).render(<App />);
