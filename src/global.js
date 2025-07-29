const localFlag = true;

const srpLocal = "http://localhost:8080/";
const srpProduction = "https://srp-backend-ez97.onrender.com/";

const webSocketUrlLocal = "ws://localhost:8080/ws/chat";
const webSocketUrlProduction = "ws://srp-backend-ez97.onrender.com/ws/chat";

export const SRP_URL = localFlag?srpLocal:srpProduction
export const WEBSOKET_URL = localFlag?webSocketUrlLocal:webSocketUrlProduction