const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'user1',
            room: 'room1'
        }, {
            id: '2',
            name: 'user2',
            room: 'room2'
        }, {
            id: '3',
            name: 'user3',
            room: 'room1'
        }];
    });

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'TestUser',
            room: 'TestRoom'
        };

        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should return users in room1', () => {
        var userList = users.getUserList('room1');
        expect(userList).toEqual(['user1', 'user3']);
    });

    it('should return users in room2', () => {
        var userList = users.getUserList('room2');
        expect(userList).toEqual(['user2']);
    });

    it('should remove an user', () => {
        var id = '1';
        var user = users.removeUser(id);

        expect(user.id).toEqual(id);
        expect(users.users.length).toBe(2);
    });

    it('should not remove an user', () => {
        var id = '123';
        var user = users.removeUser(id);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find an user', () => {
        var id = '1';
        var user = users.getUser(id);

        expect(user).toEqual(users.users[0]);
        expect(user.id).toEqual(id);
    });

    it('should not find an user', () => {
        var id = '123';
        var user = users.getUser(id);

        expect(user).toNotExist();
    });
});