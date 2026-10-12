import './styles/base.css';
import './styles/components.css';
import { MiniaturaYTApp } from './app';

document.addEventListener('DOMContentLoaded', () => {
  const app = new MiniaturaYTApp();
  app.init();
});
