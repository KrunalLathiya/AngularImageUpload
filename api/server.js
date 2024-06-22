const createApp = require('./app');
const PORT = 4000;

async function startServer() {
    const app = createApp();
    app.listen(PORT, () => {
        console.log(`Server is running on Port: ${PORT}`);
    });
}

startServer();