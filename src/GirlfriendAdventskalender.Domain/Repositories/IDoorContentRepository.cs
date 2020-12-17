using System.Collections.Generic;
using System.Threading.Tasks;
using GirlfriendAdventskalender.Domain.Models;

namespace GirlfriendAdventskalender.Domain.Repositories {
    public interface IDoorContentRepository {
        Task<DoorContent> Load(string id);
        Task<List<DoorContent>> LoadAll();
        Task<DoorContent> Save(DoorContent doorContent);
        Task<DoorContent> Edit(DoorContent doorContent);
    }
}