import jwt from "jsonwebtoken";
import { RESPONSE_MESSAGES, API_STATUS_CODES } from "../constant/apiStatus.mjs";

const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(API_STATUS_CODES.AUTHORIZATION_FAILED).json({
                statusCode: API_STATUS_CODES.AUTHORIZATION_FAILED,
                message: RESPONSE_MESSAGES.AUTHORIZATION_FAILED,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(API_STATUS_CODES.AUTHORIZATION_FAILED).json({
            statusCode: API_STATUS_CODES.AUTHORIZATION_FAILED,
            message: RESPONSE_MESSAGES.AUTHORIZATION_FAILED,
        });
    }
};

export default jwtMiddleware;
