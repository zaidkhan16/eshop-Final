const app = require("./app");

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env",
    });
}

// create server only when run directly
let server;
if (require.main === module) {
    const PORT = process.env.PORT || 8000;
    server = app.listen(PORT, () => {
        console.log(
            `Server is running on http://localhost:${PORT}`
        );
    });
}

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`shutting down the server for unhandle promise rejection`);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});

module.exports = app;