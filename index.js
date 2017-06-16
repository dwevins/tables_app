const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let sessions = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/waiter.html');
})

app.get('/table1', function(req, res) {
    res.sendFile(__dirname + '/table1.html');
})

app.get('/table2', function(req, res) {
    res.sendFile(__dirname + '/table2.html');
})

io.on('connection', function(socket) {
    const clientObj = {
        'client': socket.handshake.query.client,
        'id': socket.id
    }
    sessions.push(clientObj);

    socket.on('table busy', function(fields, table) {
        const id = sessions.find(function(session) {
            return session.client === table;
        })
        io.to(id.id).emit('table busy', fields);
    });

    socket.on('table open', function(table) {
        const id = sessions.find(function(session) {
            return session.client === 'waiter';
        })
        io.to(id.id).emit('table open', table);
    });

    socket.on('disconnect', function() {
        sessions = sessions.filter(function(session) {
            return session !== clientObj;
        });
    });
})

http.listen(process.env.PORT || 3000, function() {
})
