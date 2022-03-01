const MongoClient = require('mongodb').MongoClient;
//client from mongo server
const assert = require('assert').strict;
//node modules package 
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
//url where mongodb server can be accessed- port number where monger server is running
const dbname = 'nucampsite';
//database name we want to connect to

MongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {

    console.log('Connected correctly to server');

    const db = client.db(dbname);

    db.dropCollection('campsites')
    .then(result => {
        console.log('Dropped Collection:', result);
    })
    .catch(err => console.log('No collection to drop.'));

    //continue to next method
    dboper.insertDocument(db, {name: "Breadcrumb Trail Campground", description: "Test"}, 'campsites')
    .then(result => {
        console.log('Insert Document:', result.ops);

        return dboper.findDocuments(db, 'campsites');
    })
    .then(docs => {
        console.log('Found Documents:', docs);

        return dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" },
            { description: "Updated Test Description" }, 'campsites');
    })
    .then(result => {
        console.log('Updated Document Count:', result.result.nModified);

        return dboper.findDocuments(db, 'campsites');
    })
    .then(docs => {
        console.log('Found Documents:', docs);

        return dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
            'campsites');
    })
    .then(result => {
        console.log('Deleted Document Count:', result.deletedCount);

        return client.close();
    })
    .catch(err => {
        console.log(err);
        client.close();
    });
})
.catch(err => console.log(err));




//OLD WAY WE WROTE IT USING CALLBACKS

// MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
// //allows us to connect mongo client with mdb server
// //first argument url, second object that sets various options
// //third arg is callback w. err and client param
// //use client to connect to database and do various operations
//     assert.strictEqual(err, null);
// //check to make sure err is not null
// //first value is actual argument we are checking, second is to see the argument we are checking against to see if the first === the second- if they are === we continue, if not the asser will fail
// //when an assert fails it throws an error, terminates entire app and logs to console what went wrong- if not it will continue on will application
//     console.log('Connected correctly to server');

//     const db = client.db(dbname);
// //passing dbname we set above to this method- it will connect us to the nucampsite database on the mongo db server
// //we can use this db object to asccess a set of methods to interact with that database
//     db.dropCollection('campsites', (err, result) => {
//         //emptying db so when we test it we start w blank one each time- not normal practice
//         //drop means delete
//         assert.strictEqual(err, null);
//         console.log('Dropped Collection', result);

//         dboper.insertDocument(db, { name: "Breadcrumb Trail Campground", description: "Test"},
//         'campsites', result => {
//         console.log('Insert Document:', result.ops);

//         dboper.findDocuments(db, 'campsites', docs => {
//             console.log('Found Documents:', docs);

//             dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" },
//                 { description: "Updated Test Description" }, 'campsites',
//                 result => {
//                     console.log('Updated Document Count:', result.result.nModified);

//                     dboper.findDocuments(db, 'campsites', docs => {
//                         console.log('Found Documents:', docs);
                        
//                         dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
//                             'campsites', result => {
//                                 console.log('Deleted Document Count:', result.deletedCount);

//                                 client.close();
//                             }
//                         );
//                     });
//                 }
//             );
//         });
//     });
// });
// });

//in this code brought mongo client in and connected to it to connect this client with server.  It gave us an object to access campsite database. we deleted then re created this database and added a document.  we then used find to find all documents in this database.  we then closed out with the client and finished
//this code was a series of callback messages- this kind of callback nesting is not great