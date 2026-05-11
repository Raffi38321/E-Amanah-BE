import mongoose from "mongoose";
import ENV from "../utils/ENV";

let isConnected = false;

const connect = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(ENV.MONGO_URL);

    isConnected = db.connections[0].readyState === 1;
    console.log("berhasil konek db");
  } catch (error) {
    console.log(error);
  }
};

export default connect;