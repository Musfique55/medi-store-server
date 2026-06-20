import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

const server = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log("server is running on", PORT);
    });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

server();
