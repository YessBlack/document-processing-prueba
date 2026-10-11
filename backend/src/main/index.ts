import { App } from './App';

const app = new App();
const port = Number(process.env.PORT) || 3001;

app.start(port).catch((error) => {
  console.error('No se pudo iniciar la aplicación:', error);
  process.exit(1);
});
