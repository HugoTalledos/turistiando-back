process.loadEnvFile();

const {
  PORT, ENV
} = process.env;

export const ServerConfig = {
  port: parseInt(PORT || '8080'),
  env: ENV || ""
};

export const Cors = {
  local: [
    'http://localhost:3000',
    'http://localhost:5000',
  ],
  dev: [
    'https://catalogo-test.web.app',
    'https://app-loumitos.web.app',
    'https://catalogo-test.firebaseapp.com',
    'https://app-loumitos.firebaseapp.com',
    'https://loumitos.com',
    'https://www.loumitos.com',
  ],
  prod: [],
}