// IndexDB Connection On Web Application Load

// create an instance of a db object for us to store the IDB data in
let db;

// create a blank instance of the object that is used to transfer data into the IDB. This is mainly for reference
let item = [
      { note: "", time: "" }
];


window.onload = function() {
    // In the following line, you should include the prefixes of implementations you want to test.
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // DON'T use "var indexedDB = ..." if you're not in a function.
    // Moreover, you may need references to some window.IDB* objects:
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

    // Let us open our database
    const DBOpenRequest = window.indexedDB.open("notes", 4);

      // these two event handlers act on the database being opened successfully, or not
  DBOpenRequest.onerror = function(event) {
    console.log("INDEXDB CONNECTION ERROR");
  };

  DBOpenRequest.onsuccess = function(event) {
    // store the result of opening the database in the db variable. This is used a lot below
    db = DBOpenRequest.result;

    // Run the displayData() function to populate the task list with all the to-do list data already in the IDB
    displayData();
  };
}