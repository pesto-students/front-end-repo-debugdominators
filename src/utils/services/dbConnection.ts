import * as mongoose from "mongoose";

const dbConnect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      return connection;
    });

    connection.on("error", () => {
      process.exit();
    });
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

export default dbConnect;
