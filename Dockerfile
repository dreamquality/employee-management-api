# Используем базовый образ Node.js
FROM node:16

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm config set strict-ssl false && npm install

# Копируем остальной код приложения
COPY . .

# Указываем порт, который будет использоваться
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
