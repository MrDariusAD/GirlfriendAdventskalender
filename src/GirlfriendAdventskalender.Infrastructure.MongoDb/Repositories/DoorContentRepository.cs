using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GirlfriendAdventskalender.Domain.Models;
using GirlfriendAdventskalender.Domain.Repositories;
using MongoDB.Bson;
using MongoDB.Driver;

namespace GirlfriendAdventskalender.Infrastructure.MongoDb.Repositories {
    public class DoorContentRepository : IDoorContentRepository {
        private static MongoClient _client;
        private string _lastDatabase;
        private string _lastCollection;
        private IMongoDatabase _database;
        private IMongoCollection<DoorContent> _collection;
        public string DatabaseName{ get; }
        public string CollectionName{ get; set; }

        public void Setup() {
            OpenDatabase(DatabaseName);
            var collections =  _database.ListCollectionNames();
            if (!collections.ToList().Contains(CollectionName)) {
                _database.CreateCollection(CollectionName);
            }
            OpenCollection(CollectionName);
        }

        public DoorContentRepository(string connectionString, string databaseName, string collectionName = nameof(DoorContent) + "s") {
            DatabaseName = databaseName;
            CollectionName = collectionName;
            Connect(connectionString);
            Setup();
        }

        #region Delete

        public bool Delete(string id) {
            return _collection.DeleteOne(GetIdFilterDefinition(id)).DeletedCount > 0;
        }

        public FilterDefinition<DoorContent> GetIdFilterDefinition(string id) {
            return Builders<DoorContent>.Filter.Eq("Id", id);
        }

        #endregion

        #region Infrastructure

        public void Connect(string connectionString) {
            _client = new MongoClient(connectionString);
        }

        private void OpenDatabase(string databaseName) {
            if (_lastDatabase == databaseName) return;
            _database = _client.GetDatabase(databaseName);
            _lastDatabase = databaseName;
        }

        private void OpenCollection(string collectionName) {
            OpenDatabase(DatabaseName);
            if (_lastCollection == collectionName) return;
            _collection = _database.GetCollection<DoorContent>(collectionName);
            _lastCollection = collectionName;
        }

        #endregion

        #region Load

        public async Task<List<DoorContent>> LoadAll() {
            var cursor = await _collection.FindAsync(FilterDefinition<DoorContent>.Empty);
            var result = new List<DoorContent>();

            while (await cursor.MoveNextAsync()) result.AddRange(cursor.Current);

            return HideLockedDoorContents(result);
        }

        public async Task<DoorContent> Load(string id) {
            var query = await _collection.FindAsync(GetIdFilterDefinition(id));
            var cur   = query.ToList();
            var res   = cur?.FirstOrDefault();
            return res;
        }

        #endregion

        #region Save

        public async Task<DoorContent> Save(DoorContent doorContentToSave) {
            await _collection.InsertOneAsync(doorContentToSave);
            return doorContentToSave;
        }
        #endregion

        #region Edit

        public async Task<DoorContent> Edit(DoorContent doorContent) {
            var result = await _collection.ReplaceOneAsync(GetIdFilterDefinition(doorContent.Id), doorContent);
            return result.ModifiedCount == 1 ? doorContent : null;
        }

        #endregion

        private List<DoorContent> HideLockedDoorContents(List<DoorContent> source) {
            var lockedDoors = source.Where(x => (x.UnlocksAt - DateTime.Now) > TimeSpan.Zero).ToList();
            source.RemoveAll(x => lockedDoors.Contains(x));

            var hiddenLockedDoors = lockedDoors.Select(x => new DoorContent {
                UnlocksAt = x.UnlocksAt,
                Id = x.Id,
                ImageUrl = null,
                Text = null
            }).ToList();

            source.AddRange(hiddenLockedDoors);

            return source;
        }
    }
}
