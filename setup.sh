#!/bin/bash

echo "🚀 Configurando QA Automation Portfolio..."
echo "=========================================="

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

echo "✅ Docker y Docker Compose están instalados"

# Instalar dependencias del proyecto principal
echo "📦 Instalando dependencias del proyecto..."
npm install

# Instalar dependencias del servidor
echo "🔧 Instalando dependencias del servidor..."
cd server && npm install && cd ..

# Instalar dependencias del cliente
echo "🎨 Instalando dependencias del cliente..."
cd client && npm install && cd ..

# Instalar Playwright
echo "🧪 Instalando Playwright..."
npx playwright install --with-deps

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "Para ejecutar la aplicación:"
echo "  docker-compose up -d"
echo ""
echo "Para ejecutar las pruebas:"
echo "  npm run test"
echo ""
echo "Para ejecutar solo pruebas unitarias:"
echo "  npm run test:unit"
echo ""
echo "Para ejecutar solo pruebas E2E:"
echo "  npm run test:e2e"
echo ""
echo "Para ejecutar solo pruebas de API:"
echo "  npm run test:api"
echo ""
echo "📱 La aplicación estará disponible en:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:3001"
echo "  API Docs: http://localhost:3001/api-docs" 