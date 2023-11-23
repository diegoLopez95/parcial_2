import { User } from "./models/users";

let users: User[] = [
    {
        "id": 0,
        "username": "bielsa",
        "password": "$2b$10$WGpSbO3VjYJ2yBhjXg/f8eQT4YE31b7tzvNsdaq/KRONheIWNwAdy" //selección es la pass
    }
];

export const findUserByUsername = (username: string): User | undefined => {
    return users.find((user) => user?.username === username);
};

export const saveUser = (username: string, password: string): void => {
    const newUserId = users.length++;
    const newUser: User = { id: newUserId, username, password };
    let newUsers = users.concat(newUser);
    users = newUsers;
};