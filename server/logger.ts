import * as fs from "fs";
import * as path from "path";
import winston from "winston";

const createLogger = () => {
  const logFilename = path.join(__dirname, "server.log");

  // Remove the logger file, ignoring any errors.
  try {
    fs.unlinkSync(logFilename);
  } catch (error) {
    // do nth
  }

  return winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: logFilename,
      }),
    ],
    format: winston.format.combine(winston.format.simple()),
  });
};

export default createLogger();
