import winston from "winston";

const createLogger = () => {
  return winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.simple()),
  });
};

export default createLogger();
