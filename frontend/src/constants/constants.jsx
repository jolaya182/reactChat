const constants = {      
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttemps: 10,
    transports: ['websocket'],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false,
    chatSizeLimit: 35,
    autoConnect: true,
    url:"http://localhost:3000"
};

export default constants;
